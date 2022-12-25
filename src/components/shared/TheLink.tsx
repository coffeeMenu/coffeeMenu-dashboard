import React from 'react';
import { Link as MLink } from '@mui/material';
import { Link } from 'react-router-dom';
import './TheLink.css';

type TheLinkProps = {
  children: JSX.Element[] | JSX.Element | string;
  to: string;
};

const TheLink: React.FC<TheLinkProps> = ({ children, to }) => {
  return (
    <MLink component={Link} to={to} underline="hover">
      {children}
    </MLink>
  );
};

export default TheLink;
