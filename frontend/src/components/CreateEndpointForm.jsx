
import WasmEndpoint from './WasmEndpoint'

const CreateEndpointForm = (props) => {
    const {
        closeForm,
        user
    } = props;

    return (
        <div class="create-endpoint-background">
          <div class="create-endpoint-form">
            <WasmEndpoint user={user}/>

            <button onClick={closeForm}>Close</button>
          </div>
        </div>
    )
}

export default CreateEndpointForm;
