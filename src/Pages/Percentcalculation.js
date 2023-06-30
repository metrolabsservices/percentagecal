import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Button, message, Space, Form, Input, Typography, Row, Col, Alert, FloatButton, Switch } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';

const Container = styled.div`
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,103,121,1) 35%, rgba(0,212,255,1) 100%);
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5%;
  & .align_center{
    text-align: center;
  }
  & .innerContainer{
    @media (max-width: 1076px) {
      padding: 20px;
    }
    background-color: white;
    width: 70%;
    border-radius: 20px;
    padding: 5%;
  }

  & .header_box{
    margin: 15px;
    align-items: center;
  }

  & .main_head{
    @media (max-width: 995px) {
      font-size: x-large ;
    }
    @media (max-width: 375px) {
      font-size: large ;
    }
    @media (max-width: 285px) {
      font-size: small ;
    }
    font-size: xx-large;
    padding: 0px;
    margin: 0 0 20px 0;
  }

  & .centered-container {
    height: 100%;
    }

  & .firstInput{
    display: inline-block;
    width: calc(30% - 8px);
  }

  & .secondInput{
    display: inline-block;
    width: calc(70% - 8px);
    margin: 0 8px;
    }

  & .alterBox{
    height: 33px;
    font-size: x-small;
  }

  & .alterBox2{
    @media (max-width: 578px) {
      font-size: small ;
    }
    @media (max-width: 322px) {
      font-size: x-small ;
    }
    font-size: medium;
    text-align: center;
    font-weight: bold;
  }

  & .reset_btn{
    width: 100%;
  }

 
`;

export const Percentcalculation = () => {
    const [form] = Form.useForm();
    const [words, setWords] = useState('');
    const [prompt, setPrompt] = useState(null);
    const [afterDetuctValue2, setAfterDetuctValue2] = useState({status : true, message : "After Sell Detection Amount"});
    const [afterDetuctValue, setAfterDetuctValue] = useState({status : true, message : "After Cost Detection Amount"});
    const [sellDetuctValue, setsellDetuctValue] = useState({status : true, message : "Sell detect"});
    const [costDetuctValue, setcostDetuctValue] = useState({status : true, message : "Cost detect"});
    const [toggleStatus, settoggleStatus] = useState(false);
    const [toggleDisable, setToggleDisable] = useState(false);

    useEffect(() => {
      const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        setPrompt(event);
      };
  
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }, []);

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
        if (prompt) {
          prompt.prompt();
          prompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              message.success('App installed successfully!');
            } else {
              message.info('App installation cancelled.');
            }
            setPrompt(null);
          });
        } else {
          message.error('Add to home screen not supported in this browser.');
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
                        setAfterDetuctValue2({status : true, message : `Sell Final ${(parseInt(e.totalAmount) - (sellAmount/100)*(parseInt(e.totalAmount))).toFixed(2)}`});
                    }
                    else{
                        setsellDetuctValue({status : false, message : "Enter a valid Amount in above field!"});
                        setAfterDetuctValue2({status : false, message : `Enter a valid Amount in top field!`});
                        setWords('')
                    }

                }else{
                    setsellDetuctValue({status : false, message : "Enter valid Sell amount!"});
                    setAfterDetuctValue2({status : false, message : `Enter valid Sell amount!`});
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
                        setAfterDetuctValue({status : true, message : `Cost Final ${(parseInt(e.totalAmount) - (costAmount/100)*(parseInt(e.totalAmount))).toFixed(2)}`});
                        setToggleDisable(false);
                    }
                    else{
                        setcostDetuctValue({status : false, message : "Enter a valid Amount in top field!"});
                        setAfterDetuctValue({status : false, message : `Enter a valid Amount in top field!`});
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

          <Col span={24} className='align_center'>
            <Space align='center' >
              <Row justify="space-between" className='header_box'>
                <Col xs={24} sm={24} md={18} lg={20} xl={20}>
                  <Typography.Title className='main_head'>Percent Calculator</Typography.Title>
                </Col>
                <Col xs={24} sm={24} md={6} lg={4} xl={4} main_head className='main_head'>
                  <Switch disabled={toggleDisable} checkedChildren="Enable" unCheckedChildren="Disable" onChange={toggleResp} />
                </Col>
              </Row>
            </Space>
          </Col>

          <Col>
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
                  <Alert className='alterBox' message={sellDetuctValue.message} type={sellDetuctValue.status ? "info" : "error"} />
                </Form.Item>
              </Form.Item>

              <Form.Item name='finalSellValue'>
                  <Alert className='alterBox2' message={afterDetuctValue2.message} type={afterDetuctValue2.status ? 'success' : 'error'}/>
              </Form.Item>

              <Form.Item label='Cost Charge'>
                <Form.Item name='costValue' className='firstInput'>
                  <Input
                      suffix ="%"
                      disabled={toggleStatus}
                  />
                </Form.Item>
                <Form.Item name='costdetuctValue' className='secondInput'>
                  <Alert className='alterBox' message={costDetuctValue.message} type={costDetuctValue.status ? "info" : "error"} />
                </Form.Item>
              </Form.Item>

              <Form.Item name='finalCostValue'>
                  <Alert className='alterBox2' message={afterDetuctValue.message} type={afterDetuctValue.status ? 'success' : 'error'}/>
              </Form.Item>

              <Form.Item>
                <Button className='reset_btn' danger htmlType="reset" onClick={onReset} icon={<ReloadOutlined />}>Reset</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <FloatButton
        onClick={addBookmark}
        className='float_btn'
        icon={<DownloadOutlined style={{color: 'red'}}/>}
        style={{
          top : 20,
        }}
      />
    </Container>
  )
}
