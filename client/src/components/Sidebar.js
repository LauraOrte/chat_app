import React from 'react'
import { SideBarChatitem } from './SideBarChatitem'

export const Sidebar = () => {

    const chats = [1,2,3,4,5,6,7,8,9,10]

  return (
    
    <div className="inbox_chat">

        {
            chats.map((chat) => (
                <SideBarChatitem key={ chat } />
            ))
        }

        <SideBarChatitem />

        


        {/* <!-- Espacio extra para scroll --> */}
        <div className="extra_space"></div>


    </div>
    
  )
}
