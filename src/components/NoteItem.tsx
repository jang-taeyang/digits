'use client';

import { ListGroup } from 'react-bootstrap';
import { Note } from '@prisma/client';

/* Renders a single Contact. See ContactCard.tsx. */
const NoteItem = ({ note }: { note: Note }) => (
  <ListGroup.Item>
    <p className="fw-lighter">{note.createdAt.toLocaleDateString('en-US')}</p>
    <p>{note.note}</p>
  </ListGroup.Item>
);

export default NoteItem;
