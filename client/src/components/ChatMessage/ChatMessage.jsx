import Card from 'react-bootstrap/Card';
import { getRandomColorHex, hexToTenPercentOpacity } from '../../helpers/colour';

const ChatMessage = ({ type, sender, value }) => {
  const userColour = getRandomColorHex(sender);
  const userBackgroundColour = hexToTenPercentOpacity(userColour);

  switch (type) {
    case 'USER_JOIN':
      return (
        <div>
          <strong style={{ color: userColour }}>{sender}</strong> has joined the chat.
        </div>
      );
    case 'USER_LEAVE':
      return (
        <div>
          <strong style={{ color: userColour }}>{sender}</strong> has left the chat.
        </div>
      );
    case 'MESSAGE_RECEIVE':
      return (
        <Card style={{ backgroundColor: userBackgroundColour }}>
          <Card.Title style={{ color: userColour, fontSize: '1rem', padding: '0.5rem', marginBottom: 0 }}>
            {sender}
          </Card.Title>
          <Card.Body style={{ color: userColour, padding: '0.5rem' }}>{value}</Card.Body>
        </Card>
      );
    default:
      return null;
  }
};

export default ChatMessage;
