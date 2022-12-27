import React, { useEffect, useReducer, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Monument } from '../components/Monument';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        monuments: action.payload,
        filteredMonuments: action.payload,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FILTER_SUCCESS':
      return { ...state, filteredMonuments: action.payload };
    default:
      return state;
  }
};

export const Home = () => {
  const [{ loading, error, monuments, filteredMonuments }, dispatch] =
    useReducer(reducer, {
      monuments: [],
      filteredMonuments: [],
      loading: true,
      error: '',
    });

  const [villes, setVilles] = useState([]);
  const [searchMonument, setSearchMonument] = useState('');
  const [searchVille, setSearchVille] = useState(0);
  // const [filteredMonuments, setFilteredMonuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:8080/Projet1WebWS/villes'
        );
        setVilles(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          'http://localhost:8080/Projet1WebWS/monuments'
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchMonument == '' && searchVille != 0) {
      dispatch({
        type: 'FILTER_SUCCESS',
        payload: monuments.filter((m) => m.ville.id == searchVille),
      });
    } else if (searchMonument == '' && searchVille == 0) {
      dispatch({
        type: 'FILTER_SUCCESS',
        payload: monuments,
      });
    } else if (searchMonument != '' && searchVille != 0) {
      dispatch({
        type: 'FILTER_SUCCESS',
        payload: monuments.filter(
          (m) =>
            m.ville.id == searchVille &&
            m.nom.toLowerCase().includes(searchMonument.toLowerCase())
        ),
      });
    } else {
      dispatch({
        type: 'FILTER_SUCCESS',
        payload: monuments.filter((m) =>
          m.nom.toLowerCase().includes(searchMonument.toLowerCase())
        ),
      });
    }
  }, [monuments, searchMonument, searchVille]);

  return (
    <div>
      <Helmet>
        <title>Accueil</title>
      </Helmet>
      <div>
        <Row>
          <Col md={8}>
            <FormControl
              type="text"
              placeholder="Rechercher un monument"
              value={searchMonument}
              onChange={(e) => setSearchMonument(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={searchVille}
              onChange={(e) => setSearchVille(e.target.value)}
            >
              <option value="0">Toutes les villes</option>
              {villes.map((v) => (
                <option value={v.id} key={v.id}>
                  {v.nom}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : (
          <Row className="my-3">
            {filteredMonuments.map((m) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={m.id}>
                <Monument monument={m} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
