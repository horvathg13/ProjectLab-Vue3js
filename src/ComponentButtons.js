export default
{
    
    admin:[
        {
            label:"Bann User",
            emit:{event: "DataSave",data:this.data, str:"BannUser"},
            class:"ui small red button item",
            icon:"ui close icon",
            onclick:"DataSaveEmit",
        },
        {
            label:"Roles",
            emit:{event: "DataSaveRolesEmit",data:this.data, str:"open_show_role_selector_modal"},
            class:"ui small purple button item",
            icon:"ui balance scale icon",
            onclick:"DataSaveRolesEmit"
        },
        {
            label:"Reset\npassword",
            emit:{event: "DataSaveResetPassword",data:this.data, str:"PasswordResetManual"},
            class:"ui small orange button item",
            icon:"ui key icon",
            onclick:"DataSaveResetPasswordEmit",
        },
        {
            label:"Employees",
            emit:{event: "showParticipantModal",data:this.data},
            class:"ui small green button item",
            icon:"ui user plus icon",
            onclick:"showParticipantModalEmit"
        },

    ],

    
    manager:[
        {
            label:"Employees",
            emit:{event: "showParticipantModal",data:this.data},
            class:"ui small green button item",
            icon:"ui user plus icon",
            onclick:"showParticipantModalEmit"
        },
        {
            label:"Attach To\n Employee",
            emit:{event: "Attach_Modal",data:this.data},
            class:"ui normal green button item",
            icon:"ui user puls icon",
            onclick:"Attach_ModalEmit"
            
        }
        
    ],
    employee:[
        {
            label:"View Tasks",
            emit:{event: "redirect",data:this.data},
            class:"ui small orange button item",
            icon:"ui tasks icon",
            onclick:"redirectEmit"
        },
        {
            label:"Comments",
            emit:{event: "CommentEmit",data:this.data},
            class:"ui small blue button item",
            icon:{primary:"ui comments icon",secoundary:"ui red bell icon"},
            onclick:"CommentEmit"
        }, 
        {
            label:"Attach To\n Myself",
            emit:{event: "AttachMyself",data:this.data},
            class:"ui normal green button item",
            icon:"ui user puls icon",
            onclick:"AttachMyselfEmit"
            
        },
    ]
    
}