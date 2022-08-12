import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = (event, runTrigger, handleClose) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const name = etf.name.value;
  const address = etf.address.value;
  const city = etf.city.value;

  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/libraries/add`, {
      name,
      address,
      city,
    })
    .then((response) => {
      if (response.status === 201) {
        handleClose();
        runTrigger();
      }
    })
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const AddLibrary = ({ libId, runTrigger, handleClose }) => {
  return (
    <>
      <Modal size="lg" show={libId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nova kniznica</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nazov kniznice</Form.Label>
              <Form.Control name="name" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresa</Form.Label>
              <Form.Control name="address" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mesto</Form.Label>
              <Form.Control name="city" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(event, runTrigger, handleClose);
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

export default AddLibrary;
