export default{
    Users:{
        admin:[
            {
            label:"Bann User",
            emit:{event: "DataSave",data:this.data, str:"BannUser"},
            class:"ui small red button item",
            icon:"ui close icon"
            },
            {
            label:"Roles",
            emit:{event: "DataSaveRolesEmit",data:this.data, str:"open_show_role_selector_modal"},
            class:"ui small purple button item",
            icon:"ui balance scale icon"
            },
            {
            label:"Reset\npassword",
            emit:{event: "DataSaveResetPassword",data:this.data, str:"PasswordResetManual"},
            class:"ui small orange button item",
            icon:"ui key icon"
            }

        ]
    },
    Projects:{
        admin:[
            {
                label:"Employees",
                emit:{event: "showParticipantModal",data:this.data},
                class:"ui small green button item",
                icon:"ui user plus icon",
            },
        ],
        manager:[
            {
                label:"View Tasks",
                emit:{event: "redirect",data:this.data},
                class:"ui small orange button item",
                icon:"ui tasks icon",
            },
            {
                label:"Employees",
                emit:{event: "showParticipantModal",data:this.data},
                class:"ui small green button item",
                icon:"ui user plus icon",
            },
            {
                label:"Comments",
                emit:{event: "CommentEmit",data:this.data},
                class:"ui small blue button item",
                icon:{primary:"ui comments icon",secoundary:"ui red bell icon"}
                
            },
            
        ],
        employee:[
            {
                label:"View Tasks",
                emit:{event: "redirect",data:this.data},
                class:"ui small orange button item",
                icon:"ui tasks icon",
            },
            {
                label:"Comments",
                emit:{event: "CommentEmit",data:this.data},
                class:"ui small blue button item",
                icon:{primary:"ui comments icon",secoundary:"ui red bell icon"}
            },
        ]
    },
    Tasks:{
        manager:[
            {
                label:"Comments",
                emit:{event: "CommentEmit",data:this.data},
                class:"ui small blue button item",
                icon:"ui comments icon",
                secoundary_icon:"ui red bell icon"
            },
            {
                label:"Attach To\n Employee",
                emit:{event: "Attach_Modal",data:this.data},
                class:"ui normal green button item",
                icon:"ui user puls icon",
                
            }
        ],
        employee:[
            {
                label:"Attach To\n Myself",
                emit:{event: "AttachMyself",data:this.data},
                class:"ui normal green button item",
                icon:"ui user puls icon",
                
            },
            {
                label:"Comments",
                emit:{event: "CommentEmit",data:this.data},
                class:"ui small blue button item",
                icon:"ui comments icon",
                secoundary_icon:"ui red bell icon"
            },

        ]
    }
}