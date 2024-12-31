import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        
        &copy; 2024 JuanParra
        
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
