import { Form, Button, Select, Collapse } from "antd";

function FormComponent({ form, onFinish, onCollapse }: any) {
  return (
    <div id='lineForm'>
      <Collapse
        onChange={onCollapse}
        items={[{
          key: "1",
          label: "Create your own line",
          showArrow: false,
          children: (
            <Form
                form={form}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
                style={{ maxWidth: 600, padding:0 }}
                className='newLineForm'
            >
                <Form.Item
                    className='transport'
                    label="Select"
                    name="transportType"
                    rules={[{ required: true, message: "Please select a transport type!" }]}
                >
                    <Select className='Select'
                    style={{ width: 130 }}
                    options={[
                      { value: "Bus", label: "Bus" },
                      { value: "Tram", label: "Tram" },
                      { value: "S_Bahn", label: "S-Bahn" },
                    ]} />
                </Form.Item>
                <Form.Item
                    className='interval'
                    label="Interval"
                    name="interval"
                    rules={[{ required: true, message: "Please select an interval!" }]}
                >
                    <Select className='Select'
                    style={{ width: 130 }}
                    options={[
                      { value: "3.5", label: "3.5min" },
                      { value: "7", label: "7min" },
                      { value: "15", label: "15min" },
                      { value: "30", label: "30min" },
                      { value: "60", label: "1h" },
                    ]} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 3 }} className='submit' style={{ margin: 0 }}>
                    <Button type="primary" htmlType="submit" >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
          ),
        }]}
      />
    </div>
  );
}

export default FormComponent;
