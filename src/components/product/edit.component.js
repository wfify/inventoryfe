import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        const { product } = response.data;
        setTitle(product.title);
        setDescription(product.description);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          text: 'Failed to fetch product data'
        });
      }
    };
    fetchProduct();
  }, [id]);

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PATCH'); // override method to PATCH
    formData.append('title', title);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await axios.post(`http://localhost:8000/api/products/${id}`, formData, {
        headers: {
          'Accept': 'application/json'
          // Jangan set Content-Type manual, biarkan browser atur otomatis
        }
      });

      Swal.fire({
        icon: 'success',
        text: data.message
      });

      navigate('/');
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Something went wrong!'
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Edit Product</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(([key, value]) => (
                            <li key={key}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={updateProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
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
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
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

export default EditComponent;
