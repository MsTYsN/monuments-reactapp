import React, { useEffect, useReducer, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Galleria } from 'primereact/galleria';
import noImage from '../assets/no-image.png';
import { GoLocation } from 'react-icons/go';
import { TbBuildingMonument } from 'react-icons/tb';
import { VscPerson } from 'react-icons/vsc';
import { BiCommentDetail } from 'react-icons/bi';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import moment from 'moment';
import { Monument } from '../components/Monument';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, monument: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FILTER_SUCCESS':
      return { ...state, closeMonuments: action.payload };
    default:
      return state;
  }
};

const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 5,
  },
  {
    breakpoint: '768px',
    numVisible: 3,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
  },
];

const itemTemplate = (item) => {
  return (
    <img
      src={item.url}
      className="galleria-item"
      onError={(e) => (e.target.src = noImage)}
      alt={item.id}
    />
  );
};

const thumbnailTemplate = (item) => {
  return (
    <img
      src={item.url}
      className="galleria-thumbnail"
      onError={(e) => (e.target.src = noImage)}
      alt={item.id}
    />
  );
};

export const MonumentDetails = ({monuments}) => {
  const [{ loading, error, monument, closeMonuments }, dispatch] = useReducer(reducer, {
    monument: null,
    closeMonuments: monuments,
    loading: true,
    error: '',
  });

  const { id } = useParams();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDIjiKyFOGhw-ts0LgdF6MiWYsTioLM9LQ',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `http://localhost:8080/Projet1WebWS/monuments/${id}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', err });
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if(monument != null)
    dispatch({type: 'FILTER_SUCCESS', payload: monuments.filter(m => m.id != monument.id && CheckDistanceBetweenTwoLocations({latitude: monument.latitude, longitude: monument.longitude}, {latitude: m.latitude, longitude: m.longitude}))});
  }, [monument, monuments]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{monument.nom}</title>
      </Helmet>
      <Row style={{ marginBottom: '50px' }}>
        <Col lg={5}>
          <Galleria
            value={monument.images}
            responsiveOptions={responsiveOptions}
            numVisible={5}
            className="galleria"
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
            showThumbnailNavigators={false}
            showIndicators={true}
          />
        </Col>
        <Col lg={7}>
          {!isLoaded ? (
            <div>Loading...</div>
          ) : (
            <div className="map-container">
              <Map lt={monument.latitude} lg={monument.longitude} />
            </div>
          )}
        </Col>
      </Row>
      <div className="infoBox">
        <div className="d-flex align-items-center">
          <TbBuildingMonument className="icon-size" />
          <span className="text-placement">{monument.nom}</span>
        </div>
        <div className="d-flex align-items-center">
          <GoLocation className="icon-size" />
          <span className="text-placement">{monument.adresse}</span>
        </div>
        <div className="d-flex align-items-center">
          <VscPerson className="icon-size" />
          <span className="text-placement">
            {monument.createur.prenom} {monument.createur.nom} (
            {moment(monument.createur.debut, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            - {moment(monument.createur.fin, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            )
            {/* {moment(monument.createur.debut).format('DD/MM/YYYY')} -{' '}
            {moment(monument.createur.fin).format('DD/MM/YYYY')} */}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <span>
            <BiCommentDetail className="icon-size" /> {monument.description}
          </span>
        </div>
      </div>
      <Row className="my-3">
        {closeMonuments.length > 0 && <h3 style={{marginBottom: '20px'}}>Monuments proches</h3>}
            {closeMonuments.map((m) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={m.id}>
                <Monument monument={m} />
              </Col>
            ))}
      </Row>
    </div>
  );
};

function Map({ lt, lg }) {
  const center = useMemo(() => ({ lat: lt, lng: lg }), []);

  return (
    <GoogleMap zoom={15} center={center} mapContainerClassName="map-container">
      <MarkerF position={center} />
    </GoogleMap>
  );
}

function CheckDistanceBetweenTwoLocations(location1, location2) {
  // Convert the latitudes and longitudes to radians
  const lat1 = toRadians(location1.latitude);
  const lon1 = toRadians(location1.longitude);
  const lat2 = toRadians(location2.latitude);
  const lon2 = toRadians(location2.longitude);

  // Calculate the distance using the Haversine formula
  const EARTH_RADIUS = 6371; // Earth's radius in kilometers
  const distance =
    2 *
    EARTH_RADIUS *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
      )
    );

  return distance <= 10;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
