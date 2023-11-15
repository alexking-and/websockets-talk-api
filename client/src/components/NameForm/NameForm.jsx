import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import qrCode from '../../images/qr.png';
import './NameForm.css';

const NameForm = ({ onSubmit }) => {
  const [name, setName] = useState('');

  return (
    <>
      <div className="qr-code-container">
        <img src={qrCode} alt="QR code" className="qr-code" />
        <h3><a href={process.env.REACT_APP_PUBLIC_URL}>{process.env.REACT_APP_PUBLIC_URL}</a></h3>
      </div>
      <br />
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Enter your name:</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <br />
        <Button onSubmit={() => onSubmit(name)}>Enter Chat</Button>
      </Form>
    </>
  );
};

export default NameForm;
