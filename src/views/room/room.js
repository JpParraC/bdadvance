import React, { useState, useEffect } from "react";
import { Carousel, Card, Button } from "react-bootstrap";
import { Star } from "lucide-react";
import AddEquipmentModal from "./modalequipment";
import RoomsTable from "./tablerooms"; // Importamos el componente RoomsTable

// Información de las habitaciones (sampleRooms)
const sampleRooms = [
  {
    id: 3,
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
    id: 5,
    title: "Cozy Cabin in the Mountains",
    description: "A warm and inviting cabin with a fireplace and beautiful mountain scenery.",
    price: "$180/night",
    rating: 4.6,
    images: [
      "/src/assets/images/suite1.webp",
      "/src/assets/images/suite2.webp",
      "/src/assets/images/siote3.webp",
      "/src/assets/images/suite4.webp",
      "/src/assets/images/suite5.webp"
    ]
  },
  {
    id: 8,
    title: "Modern Apartment in the City",
    description: "A stylish modern apartment located in the heart of the city with great amenities.",
    price: "$200/night",
    rating: 4.7,
    images: [
      "/src/assets/images/single1.webp",
      "/src/assets/images/single 3.webp",
      "/src/assets/images/single 5.webp"
    ]
  },
  {
    id: 9,
    title: "Rustic Farmhouse Retreat",
    description: "A charming farmhouse retreat with nature surroundings and rustic interiors.",
    price: "$150/night",
    rating: 4.5,
    images: [
      "/src/assets/images/executive1.webp",
      "/src/assets/images/executive2.webp",
      "/src/assets/images/executive3.webp",
      "/src/assets/images/executive4.webp",
      "/src/assets/images/executive5.webp"
    ]
  },
  {
    id: 11,
    title: "Beachfront Bungalow",
    description: "A cozy beachfront bungalow perfect for a relaxing getaway.",
    price: "$220/night",
    rating: 4.9,
    images: [
      "/src/assets/images/twin1.avif",
      "/src/assets/images/twin2.avif",
      "/src/assets/images/twin3.avif",
      "/src/assets/images/twin5.avif"
    ]
  }
];

const RoomGallery = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch de roomTypes desde el API
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roomtypes/");
        const data = await response.json();
        setRoomTypes(data); // Guardamos los roomTypes en el estado
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleOpenAddEquipmentModal = (room) => {
    setSelectedRoom(room); // Al hacer clic en el botón, puedes pasar la habitación seleccionada
    setShowAddEquipmentModal(true);
  };

  const handleCloseAddEquipmentModal = () => {
    setShowAddEquipmentModal(false);
  };

  // Mapeamos la información de `roomTypes` en `sampleRooms` para que cada habitación tenga su tipo de habitación y datos adicionales
  const mappedRooms = sampleRooms.map((room) => {
    const roomType = roomTypes.find((type) => type.id === room.id);
    return {
      ...room,
      type: roomType ? roomType.type : "Unknown",
      capacity: roomType ? roomType.capacity : "N/A",
      type_bed: roomType ? roomType.type_bed : "N/A",
      size: roomType ? roomType.size : "N/A",
      hotel_floor: roomType ? roomType.hotel_floor : "N/A",
      price: roomType ? `$${roomType.price}/night` : "$0/night" // Se actualiza el precio con el dato correcto
    };
  });

  return (
    <div className="container my-5">
      <h1 className="mb-5 text-primary">Room Gallery</h1>

      {/* Botón que abre el modal para cualquier habitación */}
      <Button
        variant="primary"
        onClick={() => handleOpenAddEquipmentModal(null)} // Sin habitación seleccionada
        className="mb-4"
      >
        Add Equipment for Any Room
      </Button>

      {/* Mapeamos las habitaciones para mostrar en la galería */}
      {mappedRooms.map((room) => (
        <div key={room.id} className="row mb-5">
          <div className="col-md-6 d-flex align-items-stretch">
            <Carousel>
              {room.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 rounded" src={img} alt={`Slide ${index + 1}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div className="col-md-6 d-flex align-items-stretch">
            <Card className="p-4 shadow-lg w-100">
              <Card.Body>
                <h2 className="text-primary">{room.title}</h2>
                <p className="text-muted">{room.description}</p>
                <div className="d-flex align-items-center mb-3">
                  <Star className="text-warning" />
                  <span className="ms-2 fw-bold">{room.rating}</span>
                </div>
                <p className="fs-4 text-success">{room.price}</p>

                {/* Aquí agregamos los detalles de la habitación */}
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Capacity:</strong> {room.capacity}</p>
                <p><strong>Bed Type:</strong> {room.type_bed}</p>
                <p><strong>Size:</strong> {room.size} m²</p>
                <p><strong>Floor:</strong> {room.hotel_floor}</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      ))}

      {/* Tabla con los equipos específicos por habitación */}
      <RoomsTable />

      {/* Modal para agregar equipo */}
      {showAddEquipmentModal && (
        <AddEquipmentModal
          show={showAddEquipmentModal}
          handleClose={handleCloseAddEquipmentModal}
          selectedRoom={selectedRoom}
        />
      )}
    </div>
  );
};

export default RoomGallery;
