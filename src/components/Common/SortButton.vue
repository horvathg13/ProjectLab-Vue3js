<script>

export default{
    props:{
        data:Array,
        sortKey:{type:String},
    },
    directives:{
        
    },
    data(){
        return{
            isDropdownOpen:false,
            SelectCompData:[
                {
                    id:1,
                    name:"Ascending",
                    abridgement:'ASC',
                    icon:"sort amount up icon"
                },
                {
                    id:2,
                    name:"Descending",
                    abridgement:'DESC',
                    icon:"sort amount down icon"
                }
            ],
            sortArray:Array,
            sortedArray:[],
            selected:{},
        }
    },
    watch:{
        'data':{
            immediate:true,
            deep:true,
            handler(newValue){
                this.sortArray = newValue
                this.loader = false
                console.log("hello from sort button",this.sortArray)
            }
        },
        

    },
    methods:{
        toggleDropdown(){
            this.isDropdownOpen = !this.isDropdownOpen
        },
        
        select(v) {
            this.selected.id = v.id;
            this.selected.name = v.name;
            this.selected.abridgement = v.abridgement;
            this.selected.key = this.sortKey
            this.$emit("sorted", {selected:this.selected, key:this.sortKey})
            console.log(this.sortKey)
        },

        deleteSelected(){
            this.selected = {}
            this.$emit("deleteSelected", {key:this.sortKey})
        },
       

    }
}
</script>

<template>
   
    <div class="ui floating small icon dropdown button" :class="{labeled:Object.keys(selected).length>0}" @click="toggleDropdown" >
        <i class="sort icon"></i>
        <label><div class="selected-text">{{ selected.name ? selected.name:""  }} </div></label>
        <!--<span class="text">Filter</span>-->
        <div class=" menu" :class="{active:isDropdownOpen}"  >
            <div class="header item" @click="deleteSelected" v-if="this.SelectCompData.length>0">
                Clear <i class="trash icon"></i>
            </div>
            <div class="divider"></div>
            <div class="item" v-for="v in SelectCompData" :key="v.id" @click="select(v)">
            {{ v.name }} <i :class="v.icon"></i></div>
        </div>
        
    </div>
        
   
</template>

<style scoped>
    .header{
        min-height: 0;
        margin:5px auto !important
    }
    .header:hover{
        background-color: rgba(255, 110, 58, 0.242) !important;
    }
    .ui.dropdown{
        margin: 0 3px;
        padding:8px;
    }
    .filterMainContainer{
        display: flex;
    }
</style>