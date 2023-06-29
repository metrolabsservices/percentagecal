import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Button, message, Space, Form, Input, Typography, Row, Col, Alert, FloatButton, Switch } from 'antd';
import { ReloadOutlined, BookOutlined } from '@ant-design/icons';

const Container = styled.div`
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,103,121,1) 35%, rgba(0,212,255,1) 100%);
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10%;
  & .innerContainer{
    background-color: white;
    width: 80%;
    height: auto;
    border-radius: 20px;
    padding: 10%;
    
  }


  & .centered-container {
    height: 100%;
    }
  & .firstInput{
    display: inline-block;
    width: calc(50% - 8px);
  }
  & .secondInput{
    display: inline-block;
    width: calc(50% - 8px);
    margin: 0 8px;
    }

  & .alterBox{
    height: 33px;
    font-size: x-small;
  }
  & .alterBox2{
    font-size: medium;
    text-align: center;
    font-weight: bold;
  }
`;

export const Percentcalculation = () => {
    const [form] = Form.useForm();
    const [words, setWords] = useState('');
    const [afterDetuctValue, setAfterDetuctValue] = useState({status : true, message : "After Detection Amount"});
    const [sellDetuctValue, setsellDetuctValue] = useState({status : true, message : "Sell detect"});
    const [costDetuctValue, setcostDetuctValue] = useState({status : true, message : "Cost detect"});
    const [toggleStatus, settoggleStatus] = useState(false);
    const [toggleDisable, setToggleDisable] = useState(false);
    
    const onReset = () => {
        form.resetFields();
        setWords('');
        setcostDetuctValue({status : true, message : "Cost detect"});
        setsellDetuctValue({status : true, message : "Sell detect"});
        setAfterDetuctValue({status : true, message : "After Detection Amount"});
        setToggleDisable(false);
      };

    const toggleResp = (bool) => {
        // console.log(bool)
        settoggleStatus(bool)
    }

    const onlyNumberValidation = (vlv) => {
        const isValid = /^[0-9]{1,}$/.test(vlv);
        return(isValid)
    }

    const onlyDecimalValidation = (vlv) => {
        const isValid = /^(?=.*[1-9])\d*(\.\d+)?$/.test(vlv);
        return(isValid)
    }

    const convertNumberToWords = (num) => {
        var ones = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
        var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        if ((num = num.toString()).length > 9) return "Overflow: Maximum 9 digits can only support for now";
        let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = "";
        str += n[1] != 0 ? (ones[Number(n[1])] || tens[n[1][0]] + " " + ones[n[1][1]]) + "Crore " : "";
        str += n[2] != 0 ? (ones[Number(n[2])] || tens[n[2][0]] + " " + ones[n[2][1]]) + "Lakh " : "";
        str += n[3] != 0 ? (ones[Number(n[3])] || tens[n[3][0]] + " " + ones[n[3][1]]) + "Thousand " : "";
        str += n[4] != 0 ? (ones[Number(n[4])] || tens[n[4][0]] + " " + ones[n[4][1]]) + "Hundred " : "";
        str += n[5] != 0 ? (str != "" ? "and " : "") + (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]]) : "";
        return str;
    };

    const addBookmark = () => {
        console.log(window)
        if ('bookmark' in window.navigator) {
        // Check if the browser supports adding bookmarks
        window.navigator.bookmark('Percent calculator', window.location.href); // Add bookmark
        message.success('Bookmark added!');
        } else {
        message.error('Bookmark not supported in this browser.');
        }
    };

    const opearationalFunc = (_,e) => {
        console.log(e);
        if(typeof(e.totalAmount) !== 'string'){
         setWords('');   
        }
        if(typeof(e.sellValue) !== 'string'){
            setsellDetuctValue({status : false, message : "Invalid sell value"});   
        }
        if(typeof(e.costValue) !== 'string'){
            setcostDetuctValue({status : false, message : "Invalid cost value"});   
            setToggleDisable(true)
        }
        if(typeof(e.totalAmount) === 'string'){
            let mainAmount = e.totalAmount;
            if(mainAmount.length < 1){
                setWords(''); 
            }
            else{
                let validate = onlyNumberValidation(mainAmount);
                if(validate){
                    const numberToWords = convertNumberToWords(parseInt(mainAmount));
                    setWords(numberToWords); 
                }
            }
        }
        if(typeof(e.sellValue) === 'string'){
            let sellAmount = e.sellValue;
            if(sellAmount.length < 1){
                setsellDetuctValue({status : false, message : "please enter sell value to evaluate"});  
            }
            else{
                let validation = onlyDecimalValidation(sellAmount);
                let validation2 = onlyNumberValidation(e.totalAmount);

                if(validation){
                    if(validation2){
                        sellAmount = parseFloat(sellAmount);
                        setsellDetuctValue({status : true, message : `${((sellAmount/100)*(parseInt(e.totalAmount))).toFixed(2)}`});
                    }
                    else{
                        setsellDetuctValue({status : false, message : "Enter a valid Amount in above field!"});
                        setWords('')
                    }

                }else{
                    setsellDetuctValue({status : false, message : "Enter valid Sell amount!"});
                }
            }
        }
        if(typeof(e.costValue) === 'string'){
            let costAmount = e.costValue;
            if(costAmount.length < 1){
                setcostDetuctValue({status : false, message : "please enter cost value to evaluate"});  
                setToggleDisable(true);
            }
            else{
                let validation = onlyDecimalValidation(costAmount);
                let validation2 = onlyNumberValidation(e.totalAmount);

                if(validation){
                    if(validation2){
                        costAmount = parseFloat(costAmount);
                        setcostDetuctValue({status : true, message : `${((costAmount/100)*(parseInt(e.totalAmount))).toFixed(2)}`});
                        setAfterDetuctValue({status : true, message : `${(parseInt(e.totalAmount) - (costAmount/100)*(parseInt(e.totalAmount))).toFixed(2)}`})
                        setToggleDisable(false);
                    }
                    else{
                        setcostDetuctValue({status : false, message : "Enter a valid Amount in top field!"});
                        setAfterDetuctValue({status : false, message : `Enter a valid Amount in top field!`})
                        setWords('');
                        setToggleDisable(true);
                    }

                }else{
                    setcostDetuctValue({status : false, message : "Enter valid Cost amount!"});
                    setAfterDetuctValue({status : false, message : `Enter valid Cost amount!`});
                    setToggleDisable(true);
                }
            }
        }
        else{
            message.info('Form Validation failed, reload web page try again!')
        }
        
    }
  return (
    <Container>
      <div className='innerContainer'>
        <Row justify="center" align="middle" className='centered-container'>
          <Col>
            <Space align='baseline'>
              <Typography.Title >Percent Calculator</Typography.Title>
              <Switch disabled={toggleDisable} checkedChildren="Cost Enable" unCheckedChildren="Cost Disable" onChange={toggleResp} />
            </Space>
            <Form
              form={form}
              initialValues={{costValue : "1.3", sellValue : "1.8"}}
              onValuesChange={opearationalFunc}
            >
              <Form.Item label='Amount' name='totalAmount'  rules={[{pattern: /^\d+$/, message: 'Please enter a valid number',}]}>
                <Row>
                  <Input
                      suffix ="₹"
                    />
                  <Typography.Text>{words}</Typography.Text>
                </Row>
                  
              </Form.Item>
              
              <Form.Item label='Sell Charge'>
                <Form.Item name='sellValue' className='firstInput' rules={[{pattern: /^(\d+|\d+\.\d+)$/, message: 'Please enter a valid number',}]}>
                  <Input
                      suffix ="%"
                      pattern={/^(\d+|\d+\.\d+)$/}
                      // onChange={percentDetuctionCheck}
                  />
                </Form.Item>
                <Form.Item name='selldetuctValue' className='secondInput'>
                  <Alert className='alterBox' message={sellDetuctValue.message} type={sellDetuctValue.status ? "success" : "error"} />
                </Form.Item>
              </Form.Item>

              <Form.Item label='Cost Charge'>
                <Form.Item name='costValue' className='firstInput'>
                  <Input
                      suffix ="%"
                      disabled={toggleStatus}
                  />
                </Form.Item>
                <Form.Item name='costdetuctValue' className='secondInput'>
                  <Alert className='alterBox' message={costDetuctValue.message} type={costDetuctValue.status ? "success" : "error"} />
                </Form.Item>
              </Form.Item>

              <Form.Item name='finalyValue'>
                  <Alert className='alterBox2' message={afterDetuctValue.message} type={afterDetuctValue.status ? 'info' : 'error'}/>
                </Form.Item>
              <Form.Item>
                <Button danger htmlType="reset" onClick={onReset} icon={<ReloadOutlined />}>Reset</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <FloatButton
        onClick={addBookmark}
        tooltip={<div>Bookmark</div>}
        type="primary"
        style={{
          top : 50,
          right: 80,
        }}
        icon={<BookOutlined />}
      />
    </Container>
  )
}
