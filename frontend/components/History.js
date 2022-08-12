import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { format, parseISO, differenceInDays } from "date-fns";

const History = ({ libId, studentId, handleClose }) => {
  const [tableData, settableData] = useState([]);

  useEffect(() => {
    if (typeof studentId === "string") {
      if (libId === "all") {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/students/history/${studentId}`
          )
          .then((response) => {
            settableData(response.data);
          });
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/students/history/${libId}/${studentId}`
          )
          .then((response) => {
            settableData(response.data);
          });
      }
    }
  }, [libId, studentId]);

  return (
    <>
      <Modal size="xl" show={studentId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Historia</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    {libId === "all" && <th>id kniznice</th>}
                    <th>pozicana od</th>
                    <th>do</th>
                    <th>vratena na cas</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item) => (
                    <tr key={item.ISBN}>
                      <td>{item.ISBN}</td>
                      {libId === "all" && <td>{item.idLibrary}</td>}
                      <td>
                        {format(parseISO(item.leasDate), "dd.LL.yyyy H:mm")}
                      </td>
                      <td>
                        {format(parseISO(item.returnDate), "dd.LL.yyyy H:mm")}
                      </td>
                      {differenceInDays(
                        parseISO(item.returnDate),
                        parseISO(item.leasDate)
                      ) >= 30 ? (
                        <td style={{ color: "#ff1e00" }}>nie</td>
                      ) : (
                        <td>ano</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
};

export default History;
