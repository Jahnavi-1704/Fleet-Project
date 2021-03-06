import React, {useState, useEffect} from 'react';
import {Card, Button, Modal} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

// All the frontend code of the app is in this file
function App() {

    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState(null);                // to show in modal
    const [website, setWebsite] = useState(null);          // to show in modal
    const [description, setDescription] = useState(null);  // to show in modal
    const [searchValue, setSearchValue] = useState(null);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        console.log('inside componentDidMount()');

        // fetch the data when the app starts
        getData();
    }, []);

    // this function makes a GET request to backend
    const getData = async () => {
        console.log('inside getData()');
        let fetchedData;

        const response = await fetch('http://localhost:5000/companies', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                fetchedData = json;
                console.log(fetchedData.length);
            })
            .catch(err => console.log('error fetching data: '+ err));

        groupData(fetchedData, fetchedData.length);
    }

    // this function combines the repeated instances of a company into a single instance
    // by merging their modeTypes
    const groupData = (list, length) => {
        console.log('inside groupData()');

        // console.log('before grouping length is: ' + length);
        // console.log('is data an array of objs? : ' + Array.isArray(list));

        let index = list.findIndex((element) => element.name == 'Wheels');
        console.log(index);

        let newArray = [];
        for(let i=0;i<length;i++)
        {
            let index1 = newArray.findIndex((element) => element.name == list[i].name);
            // console.log(index1);

            if(index1 == -1)
            {
                // console.log('its a new element');
                let modeArray = [];
                modeArray.push(list[i].modeType);
                list[i].modeType = modeArray;
                newArray.push(list[i]);
            }
            else {
                // console.log('its a repeated element with different modeType');
                let newModeArray = newArray[index1].modeType;
                newModeArray.push(list[i].modeType);
                newArray[index1].modeType = newModeArray;
            }

        }

        setData(newArray);

        // console.log('grouped data is now: ' + newArray);
        // console.log('after grouping length is: ' + newArray.length);
    }

    // this function updates the state variables when user clicks a card
    // and opens the details modal
    const onClick = (index) => {
        // console.log('Card was clicked');
        // console.log(index);

        setWebsite(data[index].website);
        setDescription(data[index].description);
        setName(data[index].name);

        setModalOpen(true);
    }

    // this function closes the open details modal
    const handleModalClose = () => setModalOpen(false);

    // this function makes a PUT request to backend to update details of a company
    const onUpdate = async () => {
        console.log('inside onUpdate()');
        let url = 'http://localhost:5000/companies/:' + name;

        // console.log('company is: ' + name);
        // console.log('new website is: ' + website);
        // console.log('new desc is: ' + description);

        handleModalClose();

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                website: website,
                description: description,
            })
        })
            .then(response => response.json())
            .then(json =>  console.log(json))
            .catch(err => console.log('error updating data: '+ err));

        // finally, fetch the updated data from DB to display
        getData();
    }

    // this function updates the state variable website with user input
    const updateWebsite = (event) => {
        console.log(event.target.value);
        setWebsite(event.target.value);
    }

    // this function updates the state variable description with user input
    const updateDescription = (event) => {
        console.log(event.target.value);
        setDescription(event.target.value);
    }

    // this function updates the state variable searchValue with user input
    // and calls the search function
    const updateSearch = (event) => {
        console.log(event.target.value);
        setSearchValue(event.target.value);
        search(event.target.value);
    }

    // this function filters out the data to be displayed based on the search value
    // set by the user. It searches in both company Name and the mode Type
    const search = (value) => {
        console.log('inside search()');
        // console.log('value to search is: ' + value);

        let searchArray = data.filter((element) => {

            // first we convert to lowercase both strings we want to compare so that to ensure we
            // are not leaving out objects just because of case related issues
            let lowerName = element.name.toLowerCase();
            let lowerValue = value.toLowerCase();
            if(lowerName.includes(lowerValue))
            {
                // console.log('found value in name');
                return true;
            }

            let modeArray = element.modeType;
            let index = modeArray.findIndex(transport => transport.toLowerCase().includes(lowerValue));
            if(index != -1)
            {
                // console.log('found value in modeType array');
                return true;
            }

        });

        // console.log(searchArray);
        // console.log(data);

        // Here I initially was doing setData(searchArray) but the issue was
        // the array was displaying correctly in the console but on the browser nothing showed up.
        // So, as an alternative I am now using this new state variable called searchData.
        // And in the render part, I am displaying either data or searchData based on if the searchValue is set by user
        setSearchData(searchArray);
    }

    // this function separates the elements of modeType array with commas
    // for display purposes
    const modeTypeSeparator = (modeType) => {
        console.log('inside modeTypeSeparator()');
        // console.log('combined string is: ' + modeType);

        let length = modeType.length;
        let string;
        for(let i=0;i<length;i++)
        {
            if(string)
            {
                string = string + ', ' + modeType[i];
            }
            else {
                string = modeType[i];
            }

        }

        // console.log('separated string is: ' + string);
        return string;
    }


    return (
        <>
            <div style={{paddingTop: 20, paddingLeft: 190, fontSize: '50px', fontWeight: 'bold'}}>
                <p>Available Services</p>
            </div>

            <div style={{paddingRight: 190, paddingLeft: 190}}>
                {searchValue ?
                    null
                    :
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" style={{fontSize: 24, color: '#808080'}}/>
                }
                <input className="form-control form-control-lg border-secondary py-2 searchField" type="search"
                       placeholder="Search for a specific service"
                       onChange={updateSearch}
                       style={{backgroundColor: '#f6f5f4'}}
                />
            </div>

            {searchValue ?
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px'}} className="Card">
                    {searchData.map((company, i) => (
                        <Card onClick={() => onClick(i)}
                              style={{width: '18rem', margin: '10px', borderRadius: '5%', paddingTop: 15, paddingLeft: 15, flex: '0 0 500px'}}
                              className="single-content"
                        >
                            <Card.Img variant="top" src={company.icon} style={{borderRadius: '20%', width: '5rem', padding: 5}} />
                            <Card.Body>
                                <Card.Title style={{fontWeight: 'bold'}}>{company.name}</Card.Title>
                                <Card.Text>{modeTypeSeparator(company.modeType)}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                :
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px'}} className="Card">
                    {data.map((company, i) => (
                        <Card onClick={() => onClick(i)}
                              style={{width: '18rem', margin: '10px', borderRadius: '5%', paddingTop: 15, paddingLeft: 15, flex: '0 0 500px'}}
                              className="single-content"
                        >
                            <Card.Img variant="top" src={company.icon} style={{borderRadius: '20%', width: '5rem', padding: 5}} />
                            <Card.Body>
                                <Card.Title style={{fontWeight: 'bold'}}>{company.name}</Card.Title>
                                <Card.Text>{modeTypeSeparator(company.modeType)}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            }

            <Modal
                show={modalOpen}
                onHide={handleModalClose}
                centered={true}
                size='lg'
            >
                <div style={{paddingRight: 20}}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div style={{fontSize: 30, fontWeight: 'bold', paddingLeft: 10}}>
                                {name}
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                </div>

                <Modal.Body>
                    <div style={{paddingLeft: 10, paddingRight: 20}}>
                        <p style={{fontSize: 20}}>Website</p>
                        <input type="text" defaultValue={website} className="form-control form-control-lg"
                               onChange={updateWebsite}
                        />
                    </div>

                    <div style={{paddingLeft: 10, paddingTop: 10, paddingRight: 20}}>
                        <p style={{fontSize: 20}}>Description</p>
                        <textarea defaultValue={description} className="form-control form-control-lg"
                                  onChange={updateDescription}
                        />
                    </div>
                </Modal.Body>

                <div style={{flex: 1, paddingLeft: 555, marginBottom: 15}}>
                    <Button style={{margin: 13, borderRadius: 7, borderColor: '#5D3FD3', borderWidth: 2, backgroundColor: '#FFFFFF', color: '#5D3FD3'}} size='lg' onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button style={{borderRadius: 7, borderWidth: 2, borderColor: '#5D3FD3', backgroundColor: '#5D3FD3'}} size='lg' onClick={onUpdate}>
                        Update
                    </Button>
                </div>

            </Modal>

        </>
    );
}

export default App;