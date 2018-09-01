import React, { Component } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
  FormGroup,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Container,
  Col,
  Label
} from 'reactstrap';
import {
  AvForm,
  AvGroup,
  AvFeedback,
  AvInput,
  AvRadioGroup,
  AvRadio
} from 'availity-reactstrap-validation';
import firebase from 'firebase';
import Footer from './footer';
import FileUploader from 'react-firebase-file-uploader';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: '',
      showModal: false,
      errorMessage: '',
      isUploading: false,
      progress: 0,
      avatar: '',
      avatarURL: ''
    };
  }

  handleValidSubmit = (event, values) => {
    if (!this.state.isUploading) {
      this.setState({ values });
      this.toggleModal();
    } else {
      alert('請等待圖片上傳完畢！');
    }
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  uploadData = () => {
    const { values } = this.state;
    var connectedRef = firebase.database().ref('.info/connected');
    var questionBankRef = firebase
      .database()
      .ref('/questionBank/' + values.difficulty);
    //console.log(i);
    //connectedRef.on("value", (snap) => {
    var now;
    //if (snap.val() === true) {
    questionBankRef.child('total').once('value', snap => {
      now = snap.val() + 1;
      questionBankRef.update({ total: now }).then(
        questionBankRef
          .child(now)
          .set(this.state.values)
          .then(() => {
            window.location.reload();
            alert('上傳成功！');
          })
          .catch(error => {
            this.toggleModal();
            alert(error.message);
          })
      );
    });

    //   else {
    //     alert("連線失敗");
    //   }
    // });
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => {
    this.setState({ progress });
  };

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref('images')
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  renderOptions = () => {
    var optionsArray = [];
    for (let i = 0; i < 4; i++) {
      var option = String.fromCharCode('A'.charCodeAt() + i);
      optionsArray.push(
        <AvGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">{option}</InputGroupAddon>
            <AvInput
              type="text"
              required
              name={option}
              autoSuggest="false"
              //onChange={this._setState.bind(this)}
            />
            <AvFeedback>此為必填</AvFeedback>
          </InputGroup>
        </AvGroup>
      );
    }
    return optionsArray;
  };

  render() {
    const { values } = this.state;
    console.log(this.state.avatarURL);
    return (
      <div style={{ backgroundColor: '#FF8000' }}>
        <Container>
          <Row>
            <Col sm="4" md="2" />
            <Col xs="12" sm="4" md="8" style={styles.container}>
              <AvForm onValidSubmit={this.handleValidSubmit.bind(this)}>
                <Label style={{ marginTop: 50 }}>
                  注意：平方請用 "^2" 或 "平方"，根號請複製 "√" ，分數請用
                  "a/b"，聯立方程式請以｛ A式 , B式 ｝表示。
                </Label>
                <AvGroup style={{ marginTop: 10 }}>
                  <h5>題幹 Description</h5>
                  <AvInput
                    //invalid={error["content"]}
                    //invalid = {this.state.error}
                    type="textarea"
                    placeholder="輸入題目敘述 Please type in the description for the problem."
                    //onChange={this._setState.bind(this)}
                    name="content"
                    rows={10}
                    id="content"
                    autoFocus
                    required
                  />
                  <AvFeedback>此為必填</AvFeedback>
                </AvGroup>
                <h5 style={{ marginTop: 30 }}>選項 Options</h5>
                {this.renderOptions()}

                <h5 style={{ marginTop: 30 }}>正確答案 Correct Option</h5>
                <AvGroup>
                  <AvRadioGroup inline name="answer" required>
                    <AvRadio label="A" value="A" />
                    <AvRadio label="B" value="B" />
                    <AvRadio label="C" value="C" />
                    <AvRadio label="D" value="D" />
                  </AvRadioGroup>
                  <AvFeedback>此為必填</AvFeedback>
                </AvGroup>

                <h5 style={{ marginTop: 30 }}>難度 Difficulty</h5>
                <AvRadioGroup inline name="difficulty" required>
                  <AvRadio label="簡單" value="easy" />
                  <AvRadio label="中等" value="medium" />
                  <AvRadio label="困難" value="hard" />
                </AvRadioGroup>

                <h5 style={{ marginTop: 30 }}>
                  圖（非必填）Photo(if required)
                  {this.state.isUploading ? this.state.progress + '%' : null}
                </h5>
                <FormGroup>
                  {/* <label
                    style={{
                      backgroundColor: 'steelblue',
                      color: 'white',
                      padding: 8,
                      borderRadius: 4,
                      pointer: 'cursor'
                    }}
                  >
                    請選擇圖檔 */}
                  <FileUploader
                    //hidden
                    accept="image/*"
                    name="avatar"
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                  />
                  {/* </label> */}
                  <FormText>
                    請使用白色為背景 Please use a white background.
                  </FormText>
                </FormGroup>

                <Button
                  type="submit"
                  color="success"
                  style={{ marginTop: 10, marginBottom: 50 }}
                >
                  提交
                </Button>
                <Modal
                  isOpen={this.state.showModal}
                  toggle={this.toggleModal}
                  //className={this.props.className}
                >
                  <ModalHeader toggle={this.toggleModal}>確認題目</ModalHeader>
                  <ModalBody>
                    {values.content}
                    <br />
                    (A) {values.A}
                    <br />
                    (B) {values.B}
                    <br />
                    (C) {values.C}
                    <br />
                    (D) {values.D}
                    <br />
                    ----------------------------------------------------------------
                    <br />
                    正確答案： {values.answer}
                    <br />
                    難度： {values.difficulty}
                    <br />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={this.uploadData}>
                      確認送出
                    </Button>{' '}
                    <Button color="secondary" onClick={this.toggleModal}>
                      取消
                    </Button>
                  </ModalFooter>
                </Modal>
              </AvForm>
            </Col>
            <Col sm="4" md="2" />
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}

const styles = {
  container: {
    //width:500,
    display: 'flex',
    //alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginTop: 50,
    borderRadius: 20
  },
  checkbox: {
    //width: 50,
    //alignItems:"center",
    //justifyContent:"center",
  }
};
