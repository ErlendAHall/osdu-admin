import "./App.css";
import { useFormGenerator } from "./useFormGenerator.tsx";
import { Button } from "@equinor/eds-core-react";
import {useRecord} from "./useIndexedDb.ts";
import "../assets/seeder.ts";

const mockId = "namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841";

function OSDUAdmin() {
  const formFields = useFormGenerator("osdu:wks:master-data--BHARun:2.0.0", "namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841");
  const record = useRecord(mockId)
  
  if (record) {
      return (
        <div className="outer">
          <menu>Menubar here with tabs</menu>
            {formFields.length > 0 && 
                <form>
                    <fieldset className="inputs">
                        {formFields.map((formField) => formField)}
                    </fieldset>
                    <Button type="submit">Save</Button>
                </form>}
        </div>
      );
  }
}

export default OSDUAdmin;
