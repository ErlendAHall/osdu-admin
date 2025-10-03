import "./App.css";
import { useFormGenerator } from "./useFormGenerator.tsx";
import { Button, Paper, Tooltip } from "@equinor/eds-core-react";
import { Tabs } from "@equinor/eds-core-react";
import { useState } from "react";
import {NewRecordPanel} from "./NewRecordPanel.tsx";
await import("../assets/seeder.ts");

const mockId =
  "namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841";

function OSDUAdmin() {
  const formFields = useFormGenerator(
    "osdu:wks:master-data--BHARun:2.0.0",
    mockId
  );
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs
      activeTab={activeTab}
      onChange={(index) => setActiveTab(Number(index))}
    >
      <Tabs.List>
        <Tabs.Tab>One</Tabs.Tab>
        <Tabs.Tab>Two</Tabs.Tab>
        <Tabs.Tab>New record +</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel>
          {formFields.length > 0 && (
            <form>
              <fieldset className="inputs">
                {formFields.map((formField) => formField)}
              </fieldset>
                <Paper elevation="sticky" id="elevated-menu">
                  <Tooltip title="Reset form to last save state.">
                    <Button color="danger" id="reset-button">
                      Reset
                    </Button>
                  </Tooltip>
                  <Tooltip title="Undo last change">
                    <Button color="secondary" id="undo-button">
                      Undo
                    </Button>
                  </Tooltip>
                  <Tooltip title="Save changes to OSDU">
                    <Button color="primary" id="save-button" type="submit">
                      Save
                    </Button>
                  </Tooltip>
                </Paper>
            </form>
          )}
        </Tabs.Panel>
        <Tabs.Panel>Panel two</Tabs.Panel>
        <Tabs.Panel><NewRecordPanel /></Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}

export default OSDUAdmin;
