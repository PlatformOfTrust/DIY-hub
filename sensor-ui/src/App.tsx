import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Api, Sensor } from './api';

interface Props {

}

interface State {
  addSensorDialogVisible: boolean
  removeSensorId: number,
  pendingSensors: Sensor[],
  connectedSensors: Sensor[]
  pendingSensorData: Partial<Sensor>
}

const typeSelectItems = [
  {label: 'Choose...', value: ''},
  {label: 'RuuviTag', value: 'ruuvitag'},
  {label: 'Mqtt', value: 'mqtt'}
];

export default class App extends React.Component<Props, State> {

  private pendingSensorUpdateTimer: any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      addSensorDialogVisible: false,
      removeSensorId: 0,
      pendingSensors: [],
      connectedSensors: [],
      pendingSensorData: {}
    };
  }

  componentDidMount = () => {
    this.updateConnectedSensors();
    this.updatePendingSensors();
    this.pendingSensorUpdateTimer = setInterval(() => {
      this.updatePendingSensors();
    }, 10000);
  }

  componentWillUnmount = () => {
    if (this.pendingSensorUpdateTimer) {
      clearInterval(this.pendingSensorUpdateTimer);
    }
  }

  render() {

    const { pendingSensorData } = this.state;

    return (
      <div className="content">
        <div className="card">
            <h1>Pending sensors</h1>
            <p>Sensors detected but not yet connected to the system.</p>
            <DataTable value={this.state.pendingSensors}>
              <Column style={{width: "50%"}} field="identifier" header="Hardware identifier"></Column>
              <Column style={{width: "30%"}} field="type" header="Type"></Column>
              <Column style={{width: "20%"}} header="Actions" body={(data: Sensor) => <Button className="p-button-text" icon="pi pi-check" onClick={() => this.setState({ addSensorDialogVisible: true, pendingSensorData: { ...data } })} /> }></Column>
            </DataTable>
        </div>
        <div className="card">
            <h1>Connected sensors</h1>
            <p>Sensors connected to the system.</p>
            <DataTable value={this.state.connectedSensors}>
              <Column style={{width: "10%"}} field="id" header="Sensor Id"></Column>
              <Column style={{width: "40%"}} field="identifier" header="Hardware identifier"></Column>
              <Column style={{width: "20%"}} field="name" header="Name"></Column>
              <Column style={{width: "20%"}} field="type" header="Type"></Column>
              <Column style={{width: "10%"}} header="Actions" body={(data: Sensor) => <Button className="p-button-text p-button-danger" icon="pi pi-times" onClick={() => this.setState({removeSensorId: data.id || 0})} /> }></Column>
            </DataTable>
            <Button className="p-button-text" icon="pi pi-plus" onClick={() => this.setState({ addSensorDialogVisible: true, pendingSensorData: { } })} />
        </div>
        <Dialog header="Add new sensor" style={{ width: '50vw' }} visible={this.state.addSensorDialogVisible} footer={this.renderFooter()} onHide={() => this.setState({addSensorDialogVisible: false})}>
          <h5 style={{marginBottom: "6px"}}>Name</h5>
          <InputText style={{width: "100%"}} value={pendingSensorData.name || ""} onChange={(e) => { this.setState({ pendingSensorData: {...this.state.pendingSensorData, name: e.currentTarget.value }}) }} />
          <h5 style={{marginBottom: "6px"}}>Type</h5>
          <Dropdown style={{width: "100%"}} value={pendingSensorData.type || ""} options={typeSelectItems} placeholder="Select sensor type" onChange={(e) => { this.setState({ pendingSensorData: {...this.state.pendingSensorData, type: e.value }}) }}/>
          <h5 style={{marginBottom: "6px"}}>Hardware identifier</h5>
          <InputText style={{width: "100%"}} value={pendingSensorData.identifier || ""} onChange={(e) => { this.setState({ pendingSensorData: {...this.state.pendingSensorData, identifier: e.currentTarget.value }}) }} />
        </Dialog>
        <Dialog header="Delete sensor" visible={this.state.removeSensorId > 0} modal style={{ width: '350px' }} footer={this.renderDeleteFooter()} onHide={() => this.setState({removeSensorId: 0})}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
            <span>Are you sure you want to delete sensor?</span>
          </div>
        </Dialog>
      </div>
    );
  }

  renderFooter() {
    return (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => {
              this.setState({
                addSensorDialogVisible: false,
                removeSensorId: 0
              });
            }} className="p-button-text" />
            <Button label="Add" icon="pi pi-check" onClick={() => this.addSensor() } autoFocus />
        </div>
    );
  }

  renderDeleteFooter() {
    return (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => {
              this.setState({
                addSensorDialogVisible: false,
                removeSensorId: 0
              });
            }} className="p-button-text" />
            <Button label="Delete" className="p-button-danger" icon="pi pi-trash" onClick={() => this.deleteSensor() } />
        </div>
    );
  }

  private deleteSensor = async () => {
    const { removeSensorId } = this.state;
    if (removeSensorId) {
      await Api.deleteSensor(removeSensorId);
    }
    this.setState({
      addSensorDialogVisible: false,
      removeSensorId: 0
    });
    this.updateConnectedSensors();
  }

  private addSensor = async () => {
    const { pendingSensorData } = this.state;
    if (pendingSensorData.identifier &&
        pendingSensorData.name && 
        pendingSensorData.type) {
          const sensor: Sensor = pendingSensorData as Sensor;
          await Api.createSensor(sensor);
          this.setState({
            addSensorDialogVisible: false,
            removeSensorId: 0
          });
          this.updateConnectedSensors();
          this.updatePendingSensors();
    }
  }

  private updateConnectedSensors = async () => {
    const sensors = await Api.listSensors();
    this.setState({
      connectedSensors: sensors
    });
  }

  private updatePendingSensors = async () => {
    const sensors = await Api.listSensors(true);
    this.setState({
      pendingSensors: sensors
    });
  }
}
