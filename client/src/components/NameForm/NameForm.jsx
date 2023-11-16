import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import qrCode from '../../images/qr.png';
import './NameForm.css';

const NameForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const url = `${window.location.protocol}//${window.location.host}`;

  return (
    <>
      <div className="qr-code-container">
        <img src={qrCode} alt="QR code" className="qr-code" />
        <h3>
          <a href={url}>{url}</a>
        </h3>
      </div>
      <br />
      <Form onSubmit={(e) => onSubmit(e, name)}>
        <Form.Group>
          <Form.Label>Enter your name:</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <br />
        <Button type="submit">Enter Chat</Button>
      </Form>
    </>
  );
};

export default NameForm;
