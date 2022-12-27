import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import noImage from '../assets/no-image.png';
import { GoLocation } from 'react-icons/go';

export const Monument = (props) => {
  const { monument } = props;
  return (
    <Card className="monument">
      <Link to={`/monument/${monument.id}`}>
        <img
          className="card-img-top"
          src={monument.images[0] ? monument.images[0].url : noImage}
          alt={monument.name}
          onError={(e) => (e.target.src = noImage)}
        />
      </Link>
      <Card.Body>
        <Card.Title>
          <Link to={`/monument/${monument.id}`} className="monument-name-link">
            {monument.nom}
          </Link>
        </Card.Title>
        <Card.Text>
          <GoLocation /> {monument.adresse}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
