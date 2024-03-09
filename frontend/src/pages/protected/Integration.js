import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Integration from '../../features/integration'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Summer Camp"}))
      }, [])
      
    return(
        <Integration />
    )
}

export default InternalPage