import React from 'react';
import LayoutAsideDocs from './_components/LayoutAsideDocs';

interface LayoutDocsProps {
  children: React.ReactNode;
}

const LayoutDocs = ({ children }: LayoutDocsProps) => {
  return <LayoutAsideDocs>{children}</LayoutAsideDocs>;
};

export default LayoutDocs;
