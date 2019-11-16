import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Button, Nav, Container, Row, Col, Form } from 'react-bootstrap';
import hmac from 'crypto-js/hmac-sha256'
import crypto from 'crypto-js'
import * as settings from '../lib/settings'

type InputProps = {
    title: string,
    value: string,
    type?: string,
    as?: 'input' | 'textarea' | 'select',
    setValue: (x: any) => void
}
const InputForm: React.FC<InputProps> = (props) => {
    return (
        <>
            <Form.Label column sm="3">{props.title}</Form.Label>
            <Col sm="8">
                <Form.Control type={props.type} as={props.as} value={props.value} onChange={(v: any) => { props.setValue(v.currentTarget.value) }}>
                    {props.children}
                </Form.Control>
            </Col>
        </>
    )
}

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
                    <InputForm type="text" title="Endpoint" value={endpoint} setValue={setEndpoint}></InputForm>
                    <InputForm type="text" title="Merchant UUID" value={merchant} setValue={setMerchant}></InputForm>
                    <InputForm type="text" title="Secret Key" value={secretKey} setValue={setSecretKey}></InputForm>
                </Form.Group>

                <h3>Payment Info</h3>
                <Form.Group as={Row}>
                    <InputForm type="text" title="External Order #" value={externalOrderNumber} setValue={setExternalOrderNumber}></InputForm>
                    <InputForm as="select" title="Currency" value={currency} setValue={setCurrency}>
                            <option>JPY</option>
                            <option>KRW</option>
                            <option>USD</option>
                            <option>EUR</option>
                            <option>TWD</option>
                    </InputForm>
                    <InputForm type="text" title="Amount" value={amount} setValue={setAmount}></InputForm>
                    <InputForm type="text" title="Tax" value={tax} setValue={setTax}></InputForm>
                    <InputForm type="text" title="Method" value={method} setValue={setMethod}></InputForm>
                    <InputForm type="text" title="Subtype" value={subtype} setValue={setSubtype}></InputForm>
                    <InputForm type="text" title="Return URL" value={returnURL} setValue={setReturnURL}></InputForm>
                    <InputForm type="text" title="Cancel URL" value={cancelURL} setValue={setCancelURL}></InputForm>
                </Form.Group>
                <h3>Customer Info</h3>
                <Form.Group as={Row}>
                    <InputForm type="text" title="E-mail" value={email} setValue={setEmail}></InputForm>
                    <InputForm type="text" title="Phone" value={phone} setValue={setPhone}></InputForm>
                    <InputForm type="text" title="Name" value={name} setValue={setName}></InputForm>
                    <InputForm type="text" title="Name Kana" value={nameKana} setValue={setNameKana}></InputForm>
                    <InputForm type="text" title="External Customer ID" value={externalCustomerID} setValue={setExternalCustomerID}></InputForm>
                    <InputForm as="select" title="Locale" value={locale} setValue={setLocale}>
                            <option>en</option>
                            <option>ja</option>
                            <option>ko</option>
                    </InputForm>
                </Form.Group>
            </Form>
        </div>
    );
}