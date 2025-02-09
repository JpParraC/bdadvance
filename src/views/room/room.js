import React, { useState } from "react";
import { Carousel, Card, Button } from "react-bootstrap";
import { Star } from "lucide-react";

const sampleRooms = [
  {
    id: 1,
    title: "Luxury Suite with Ocean View",
    description: "A spacious luxury suite with stunning ocean views and premium amenities.",
    price: "$250/night",
    rating: 4.8,
    images: [
      "/src/assets/images/pent1.webp",
      "/src/assets/images/pent2.webp",
      "/src/assets/images/pent3.webp",
      "/src/assets/images/pent4.webp",
      "/src/assets/images/pent5.webp"
    ]
  },
  {
    id: 2,
    title: "Cozy Cabin in the Mountains",
    description: "A warm and inviting cabin with a fireplace and beautiful mountain scenery.",
    price: "$180/night",
    rating: 4.6,
    images: [
      "/src/assets/images/suite1.webp",
      "/src/assets/images/suite2.webp",
      "/src/assets/images/siote3.webp",
      "/src/assets/images/suite4.webp",
      "/src/assets/images/suite5.webp",
    ]
  },
  {
    id: 3,
    title: "Modern Apartment in the City",
    description: "A stylish modern apartment located in the heart of the city with great amenities.",
    price: "$200/night",
    rating: 4.7,
    images: [
      "/src/assets/images/single1.webp",
      "/src/assets/images/single 3.webp",
      "/src/assets/images/single 5.webp",
    ]
  },
  {
    id: 4,
    title: "Rustic Farmhouse Retreat",
    description: "A charming farmhouse retreat with nature surroundings and rustic interiors.",
    price: "$150/night",
    rating: 4.5,
    images: [
      "/src/assets/images/executive1.webp",
      "/src/assets/images/executive2.webp",
      "/src/assets/images/executive3.webp",
      "/src/assets/images/executive4.webp",
      "/src/assets/images/executive5.webp",

    ]
  },
  {
    id: 5,
    title: "Beachfront Bungalow",
    description: "A cozy beachfront bungalow perfect for a relaxing getaway.",
    price: "$220/night",
    rating: 4.9,
    images: [
      "/src/assets/images/twin1.avif",
      "/src/assets/images/twin2.avif",
      "/src/assets/images/twin3.avif",
      "/src/assets/images/twin5.avif",
    ]
  }
];

const RoomGallery = () => {
  return (
 
    <div className="container my-5">
       <h1 className="mb-5 text-primary">Room Gallery</h1>
      {sampleRooms.map((room) => (
        <div key={room.id} className="row mb-5">
          <div className="col-md-6">
            <Carousel>
              {room.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 rounded" src={img} alt={`Slide ${index + 1}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <Card className="p-4 shadow-lg">
              <Card.Body>
                <h2 className="text-primary">{room.title}</h2>
                <p className="text-muted">{room.description}</p>
                <div className="d-flex align-items-center mb-3">
                  <Star className="text-warning" />
                  <span className="ms-2 fw-bold">{room.rating}</span>
                </div>
                <p className="fs-4 text-success">{room.price}</p>
                <Button variant="primary" className="w-100">Book Now</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomGallery;