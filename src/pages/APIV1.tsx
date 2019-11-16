import React from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter'

export const APIV1: React.FC = () => {
    return (
        <div>
            <h1>API v1</h1>
            <SyntaxHighlighter language="javascript">
                {
                    JSON.stringify({"this": "is json", "and": {"this": "is cool"}}, undefined, 2)
                }
            </SyntaxHighlighter>
        </div>
    );
}