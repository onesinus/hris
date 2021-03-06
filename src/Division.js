import React, { useState, useEffect } from "react";

import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Icon,
  Tooltip,
  Modal,
  Form,
  Select
} from "antd";

import axios from "axios";
import { BACKEND_URL } from "./config/connection";

const { confirm } = Modal;

const { Option } = Select;

function Division({ form }) {
  const [dataSource, setdataSource] = useState([]);
  const [ModalDivisionVisible, setModalDivisionVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState("");
  const [data, setData] = useState([]);

  const [dataApprover, setdataApprover] = useState([]);
  const [dataApproverUsername, setdataApproverUsername] = useState([]);

  const [firstLoad, setFirstLoad] = useState(true);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length
    },
    {
      title: "Approver",
      dataIndex: "approver_id",
      key: "approver_id",
      sorter: (a, b) =>
        a.approver_id
          ? dataApproverUsername[a.approver_id].length
          : 0 - b.approver_id
          ? dataApproverUsername[b.approver_id].length
          : 0,
      render: text => {
        return dataApproverUsername[text];
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
          <Tooltip title="Edit Division">
            <Button type="primary" onClick={() => onClickEdit(record)}>
              <Icon type="edit" />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Delete Division">
            <Button type="danger" onClick={() => onClickDelete(record)}>
              <Icon type="delete" />
            </Button>
          </Tooltip>
        </span>
      )
    }
  ];

  useEffect(() => {
    refreshData();
    getApprover();
  }, []);

  function getApprover() {
    axios.get(BACKEND_URL + "listApprover").then(res => {
      let approver = [];
      let approver_username = [];
      for (const [index, value] of res.data.data.entries()) {
        approver.push(
          <Option key={index} value={value["_id"]}>
            {value.username}
          </Option>
        );
        approver_username[value["_id"]] = value.username;
      }

      setdataApprover(approver);
      setdataApproverUsername(approver_username);
    });
  }

  function refreshData() {
    setFirstLoad(true);
    setTimeout(
      function() {
        axios.get(BACKEND_URL + "listDivision").then(res => {
          setDataNeed(res.data.data);
        });
      }.bind(this),
      1000
    );
  }

  function setDataNeed(skiw) {
    setdataSource(skiw);
    setData(skiw);
    setFirstLoad(false);
  }

  function searchData(e) {
    console.log(e.target.value);
    console.log(data);
    let dataFilter = data.filter(function(d) {
      return d.description.toLowerCase().includes(e.target.value.toLowerCase()); // dataApproverUsername[d.approver_id]?dataApproverUsername[d.approver_id].toLowerCase():""
    });
    setdataSource(dataFilter);
  }

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        if (modalData == "") {
          // Add New Data
          axios.post(BACKEND_URL + "addDivision", values);
        } else {
          axios.post(BACKEND_URL + "updateDivision", {
            id: modalData["_id"],
            update: values
          });
        }
        setModalData("");
        setModalDivisionVisible(false);
        refreshData();
      } else {
        console.log(errors);
      }
    });
  }

  function handleCancel() {
    setModalDivisionVisible(false);
  }

  function onClickAdd() {
    setModalTitle("Add Division");
    setModalData("");
    setModalDivisionVisible(true);
  }

  function onClickEdit(record) {
    setModalTitle("Edit Division");

    setModalData(record);

    setModalDivisionVisible(true);
  }

  function onClickDelete(record) {
    confirm({
      title: `Are you sure delete this division ${record.description} ?`,
      content: "When division deleted you can't get it back",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios.delete(BACKEND_URL + "deleteDivision", {
          data: {
            id: record["_id"]
          }
        });
        refreshData();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  return (
    <React.Fragment>
      <Modal
        title={modalTitle}
        visible={ModalDivisionVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form> {/*  className="login-form" */}
          <Form.Item>
            {getFieldDecorator("description", {
              initialValue: modalData ? modalData.description : "",
              rules: [
                { required: true, message: "Please input your description!" }
              ]
            })(<Input placeholder="Description" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("approver_id", {
              initialValue: modalData ? dataApproverUsername[modalData.approver_id] : undefined
              // rules: [{ required: true, message: 'Please select Approver!' }],
            })(<Select placeholder="Select Approver">{dataApprover}</Select>)}
          </Form.Item>
        </Form>
      </Modal>
      <center>
        <h3>Division List</h3>
      </center>
      <Row>
        <Col span={24}>
          <Input placeholder="Find Division" onPressEnter={searchData} />
        </Col>
        {/* <Col span={2}>
          <Button type="primary" icon="search">
            Search
          </Button>
        </Col> */}
      </Row>
      <Button
        type="primary"
        icon="plus-square"
        style={{ marginTop: "1%" }}
        onClick={onClickAdd}
      >
        Add Division
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: 6, showSizeChanger: false }}
        rowKey="_id"
        loading={firstLoad}
      />
    </React.Fragment>
  );
}

const DivisionForm = Form.create({ name: "division" })(Division);

export default DivisionForm;
