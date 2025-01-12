import ShoppingHeader from '@/pages/shopping-view/header'
import { Outlet } from 'react-router-dom'

const ShoppingLayout = () => {
  return (
    <div>
    <div><ShoppingHeader/></div>
        <main><Outlet/></main>
    </div>
  )
}

export default ShoppingLayout