import React, { useState, useEffect } from 'react';
import { Accordion, Button, Card, Nav, Container, Row, Col } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter'
import RefParser from 'json-schema-ref-parser'
import komojuSchema from '../schema.json'
import { JSONSchema4 } from 'json-schema';

type APIExecutorProps = {
    link: any,
    schema: JSONSchema4
}

const APIExecutor: React.FC<APIExecutorProps> = (props) => {
    const title = props.link.method + ' ' + props.link.href
    return (
        <>
            <h3> {title} </h3>
            <div>{props.link.description}</div>
            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={title}>
                            Expand
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={title}>
                        <Card.Body>
                            <SyntaxHighlighter language="javascript">
                                {
                                    JSON.stringify({ "this": "is json", "and": { "this": "is cool" } }, undefined, 2)
                                }
                            </SyntaxHighlighter>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    )
}

export const APIV1: React.FC = () => {
    const [schema, setSchema] = useState()
    useEffect(() => {
        // Seems RefParser updates s (the first argument) in-place which causes an circular references 2nd time
        // To avoid that, s is loaded from JSON string every time
        const parser = new RefParser()
        const s = JSON.parse(JSON.stringify(komojuSchema))
        parser.dereference(s as JSONSchema4).then((schema: any) => {
            setSchema(schema)
        })
    }, [])

    if (schema) {
        return (
            <div>
                <h1>API v1</h1>
                <> {
                    Object.keys(schema.properties).map((key) => {
                        const resource = schema.properties[key]
                        return resource.links.map((link: any) => {
                            return (
                                <APIExecutor link={link} schema={schema}></APIExecutor>
                            )
                        })
                    })
                } </>
            </div>
        );
    } else {
        return <div>Loading...</div>
    }
}