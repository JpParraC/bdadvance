// src/views/testpage/TestComponent.js

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const TestComponent = () => {
    return (
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        <h5>Componente de Prueba</h5>
                    </CCardHeader>
                    <CCardBody>
                        <p>Este es un componente de prueba utilizando CoreUI y React.</p>
                        <p>Puedes modificarlo y agregar más contenido según tus necesidades.</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default TestComponent;
