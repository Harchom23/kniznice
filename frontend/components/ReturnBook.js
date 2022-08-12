import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { map } from "lodash";
import { format, parseISO, differenceInDays } from "date-fns";

const handleReturn = (libId, ISBN, studentId, runReturnTrigger) => {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/libraries/returnBook/${libId}/${ISBN}`,
      {}
    )
    .then(() => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/students/return/${studentId}/${ISBN}`,
          {
            libId,
          }
        )
        .then(() => {
          runReturnTrigger();
        });
    });
};

const ReturnBook = ({ libId, studentId, handleClose }) => {
  const [tableData, settableData] = useState([]);
  const [returnTrigger, setreturnTrigger] = useState(false);

  const runReturnTrigger = () => {
    setreturnTrigger(!returnTrigger);
  };

  useEffect(() => {
    if (typeof studentId === "string") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/students/leasedBooks/${libId}/${studentId}`
        )
        .then((response) => {
          settableData(response.data);
        });
    }
  }, [studentId, libId, returnTrigger]);

  return (
    <>
      <Modal size="xl" show={studentId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vratenie knihy</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    <th>nazov</th>
                    <th>datum pozicania</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData &&
                    tableData.map((item) => (
                      <tr key={item.ISBN}>
                        <td>{item.ISBN}</td>
                        <td>{item.name} </td>
                        <td>
                          {format(parseISO(item.leasDate), "dd.LL.yyyy H:mm")}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              handleReturn(
                                libId,
                                item.ISBN,
                                studentId,
                                runReturnTrigger
                              );
                            }}
                          >
                            Vratit
                          </Button>
                        </td>
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

export default ReturnBook;
