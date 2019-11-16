import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Button, Nav, Container, Row, Col, Form } from 'react-bootstrap';
import hmac from 'crypto-js/hmac-sha256'
import crypto from 'crypto-js'
import * as settings from '../lib/settings'

export const HostedPage: React.FC = () => {
    const [locale, setLocale] = useState('en')
    const [endpoint, setEndpoint] = useState("https://komoju.com")
    const [merchant, setMerchant] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [externalOrderNumber, setExternalOrderNumber] = useState(crypto.lib.WordArray.random(16))
    const [currency, setCurrency] = useState("JPY")
    const [amount, setAmount] = useState("1000")
    const [tax, setTax] = useState("0")
    const [method, setMethod] = useState('credit_card')
    const [subtype, setSubtype] = useState()
    const [returnURL, setReturnURL] = useState(window.location.origin + '/return')
    const [cancelURL, setCancelURL] = useState(window.location.origin + '/cancel')
    const [email, setEmail] = useState("taro@degica.com")
    const [phone, setPhone] = useState()
    const [name, setName] = useState()
    const [nameKana, setNameKana] = useState()
    const [externalCustomerID, setExternalCustomerID] = useState()
    const [destinations, setDestinations] = useState(settings.getDestinations())

    const buildLink = function (): string {
        let params: any = [
            ['timestamp', Math.round(new Date().getTime() / 1000)],
            ['transaction[amount]', amount],
            ['transaction[currency]', currency],
            ['transaction[customer][email]', email],
            //          [  'transaction[customer][given_name]', name.split(" ")[1]],
            //          [  'transaction[customer][family_name]', name.split(" ")[0]],
            //          [  'transaction[customer][given_name_kana]', nameKana.split(" ")[1]],
            //          [  'transaction[customer][family_name_kana]', nameKana.split(" ")[0]],
            ['transaction[external_customer_id]', externalCustomerID],
            ['transaction[external_order_num]', externalOrderNumber],
            ['transaction[return_url]', returnURL],
            ['transaction[cancel_url]', cancelURL],
            ['transaction[tax]', tax],
            ['transaction[subtype]', subtype]
        ].sort((a, b) => a[0] > b[0] ? 1 : -1)
            .filter((x) => x[1] != undefined)
            .map((x) => { return encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1]) }).join('&')
        const path = '/' + locale + '/api/' + merchant + '/transactions/' + method + '/new?' + params
        const hash = hmac(path, secretKey)
        return endpoint + path + '&hmac=' + hash;
    }
    const link = buildLink();
    const setDestination = function (d: settings.Destination): void {
        setEndpoint(d.endpoint)
        setMerchant(d.merchant)
        setSecretKey(d.secretKey)
    }

    const saveDestination = function (): void {
        const dest = {
            endpoint: endpoint,
            merchant: merchant,
            secretKey: secretKey
        }
        settings.addDestination(dest)
        setDestinations(settings.getDestinations())
    }

    return (
        <div>
            <h1>Hosted Page</h1>
            <a href={link}>{link}</a>
            <Form>
                <h3>Destination</h3>
                <Row>
                    <Col sm="3"><Button variant="success" onClick={saveDestination}>Save Destination</Button></Col>
                    <Col>
                        <DropdownButton id="choose-preset" title="Choose preset">
                            {
                                destinations.map((d) => {
                                    return (
                                        <Dropdown.Item onSelect={(ek: any, e: Object) => setDestination(d)}>
                                            {d.endpoint + " | " + d.merchant}
                                            <Button size="sm" variant="outline-danger" onClick={
                                                (e: any) => {
                                                    settings.deleteDestination(d.endpoint, d.merchant);
                                                    setDestinations(settings.getDestinations())
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }
                                            }>Delete</Button>
                                        </Dropdown.Item>
                                    )
                                })
                            }
                        </DropdownButton>
                    </Col>
                </Row>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Endpoint</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={endpoint} onChange={(v: any) => { setEndpoint(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Merchant UUID</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={merchant} onChange={(v: any) => { setMerchant(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Secret Key</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={secretKey} onChange={(v: any) => { setSecretKey(v.currentTarget.value) }}></Form.Control>
                    </Col>
                </Form.Group>

                <h3>Payment Info</h3>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">External Order #</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={externalOrderNumber} onChange={(v: any) => { setExternalOrderNumber(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Currency</Form.Label>
                    <Col sm="8">
                        <Form.Control as="select" defaultValue="JPY" onChange={(v: any) => { setAmount(v.currentTarget.value) }}>
                            <option>JPY</option>
                            <option>KRW</option>
                            <option>USD</option>
                            <option>EUR</option>
                            <option>TWD</option>
                        </Form.Control>
                    </Col>
                    <Form.Label column sm="3">Amount</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue="1000" onChange={(v: any) => { setAmount(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Tax</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue="0" onChange={(v: any) => { setTax(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Method</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue="credit_card" onChange={(v: any) => { setMethod(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Subtype</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" onChange={(v: any) => { setSubtype(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Return URL</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={returnURL} onChange={(v: any) => { setReturnURL(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Cancel URL</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={cancelURL} onChange={(v: any) => { setCancelURL(v.currentTarget.value) }}></Form.Control>
                    </Col>
                </Form.Group>
                <h3>Customer Info</h3>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">E-mail</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue={email} onChange={(v: any) => { setEmail(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Phone</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" onChange={(v: any) => { setPhone(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Name</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" defaultValue="Degica Taro" onChange={(v: any) => { setName(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Name Kana</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" onChange={(v: any) => { setNameKana(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">External Customer ID</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" onChange={(v: any) => { setExternalCustomerID(v.currentTarget.value) }}></Form.Control>
                    </Col>
                    <Form.Label column sm="3">Locale</Form.Label>
                    <Col sm="8">
                        <Form.Control as="select" defaultValue="en" onChange={(v: any) => { setLocale(v.currentTarget.value) }}>
                            <option>en</option>
                            <option>ja</option>
                            <option>ko</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}