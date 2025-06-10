import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState({});

  const changeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file.name); // hanya simpan nama file
    } else {
      setImage(null);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      image: image || "", // kirim nama file, bukan file-nya
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `https://inventoryjs-three.vercel.app/products`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Optional: log data yang dikembalikan
      console.log("Created:", response.data);

      // Sukses: tampilkan SweetAlert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product created successfully!",
      });

      navigate("/");
    } catch (error) {
      console.error("Error saat create:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Product</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(
                            ([key, value]) => (
                              <li key={key}>{value}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <Form onSubmit={createProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image (filename only)</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={changeHandler}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    disabled={loading}
                    variant="primary"
                    className="mt-2"
                    size="lg"
                    block="block"
                    type="submit"
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
