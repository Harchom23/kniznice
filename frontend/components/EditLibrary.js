import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleEdit = (event, ID, runTrigger, handleClose) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const name = etf.name.value;
  const address = etf.address.value;
  const city = etf.city.value;

  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/libraries/edit/${ID}`, {
      name,
      address,
      city,
    })
    .then((response) => {
      if (response.status === 200) {
        handleClose();
        runTrigger();
      }
    })
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const EditLibrary = ({ libId, runTrigger, handleClose }) => {
  const [defaultData, setdefaultData] = useState({});
  const [ID, setID] = useState();

  useEffect(() => {
    if (typeof libId === "string") {
      setID(libId);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/libId/${libId}`)
        .then((response) => {
          setdefaultData(response.data);
        });
    }
    return setdefaultData();
  }, [libId]);

  return (
    <>
      <Modal size="lg" show={libId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Editovat kninicu `}</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nazov kniznice</Form.Label>
              <Form.Control
                name="name"
                defaultValue={defaultData?.name}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                name="address"
                defaultValue={defaultData?.address}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mesto</Form.Label>
              <Form.Control name="city" defaultValue={defaultData?.city} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleEdit(event, ID, runTrigger, handleClose);
              }}
            >
              Ulozit
            </Button>
            <Button variant="outline-danger" onClick={handleClose}>
              Zrusit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditLibrary;
