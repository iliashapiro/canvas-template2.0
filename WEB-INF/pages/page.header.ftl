<!-- This gets appended at the top for each page  -->
   
<div  ng-show="!$root.isPrinting"  id="page-header"    
    ng-controller="headerCtrl"    >
 
    <div ng-show="false" style="padding-top:100px;">
        <tm1-ui-user ng-if="!$root.loginActivated"  tm1-instance="{{$root.defaults.settingsInstance}}" 
        ng-model="$root.values.user"  ></tm1-ui-user>
    </div>
     
    <div id="mininavinternal"></div>
     
   
 
    <div    
         ng-init="$root.printOpened = false;  $root.query(true);  " 
 
    style="position:fixed; top:0px; right:0px; z-index:99999; padding:10px; padding-right:0px; margin-right:49px; height:auto;" 
        ng-if="$root.values.user && $root.values.user.FriendlyName "  >       
 
 
        <div  class="nav"  
            id="header"   
            style=" padding-top:70px; -webkit-transition:padding-top 1s; transition-property:padding-top;   top:0px; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; -webkit-transition:top 1s; transition-property:top;   transition-duration: 1.0s; vertical-align: bottom !important;  z-index:999;   position:fixed; top:0px; left:0px; width:100%;      background-position: center;  " 
            ng-init="$root.top = 65"  ng-style="{'background-color': $root.applicationHeaderColor}" > 
        
    
        
        
    
        
            <div    style="-webkit-transition:padding-top 1s; transition-property:padding-top; transition-duration: 1s; width:100%; position:fixed; left:0px; top:0px; float:left;  padding-top:0px;  "  >
                
                
                <div   style="position:fixed;  top:0px; left:0px; width:100%;">
                    <a style="z-index:99999; " href="#"  >
                        <img src="images/canvas-logo.svg" 
                        title="Your Logo Here" 
                        style="background-size:contain;display:inline-block; float:left; height: 40px; position:relative; left:0px; top:0px; margin-top:5px; margin-left: 10px; z-index:99999;" /> 
                    </a>
                    <span style="width:50px; height:50px; z-index: 999; left:130px; top:30px; display:inline-block;font-size:1.5em; padding:10px; color:#fff;">
                        <i class="fa fa-refresh fa-spin" ng-style="{'color':$root.applicationActivePageColor}" ng-show="$root.isLoading"></i>
                    </span>
                    
                    
                </div> 
            
            </div>
        
    
            <ul class="navbuttons"   ng-style="{'top': $root.showView && ($root.selections.searchInputClicked   )   ? 'calc(100% - 52px)':49+'px' , 'background-color': $root.applicationHeaderColor}"
                style="z-index:99999; vertical-align: top !important; margin:0px; box-shadow: 0px 5px 15px rgba(0,0,0,0.1); width:100%; position:fixed; padding-left:0px;   -webkit-transition:top 1s; transition-property:top; transition-duration: 1s;    " 
                ng-mouseleave = "status.isopen = false;" >
                
            
                <#--  <li   ng-click="  $root.showView = false; $root.searchFilterDropdownSelected = false; $root.selections.searchInputClicked= false;  $root.scheduleShow = false; $root.calendarShow = false;  $root.applicationTriggerFindUser();  "   
                    
                    id="home-nav-btn" ng-class="$root.activeTab === -1 || $root.activeTabOver === 'home' ? 'active':''"
                    ng-mouseover="$root.activeTabOver = 'home'"  ng-mouseleave="$root.activeTabOver = ''" >
                        
                    <a href="#" data-toggle="tab">  
                        <i   class="fa fa-home fa-1x"></i>   
                        <span class="hidden-xs"> Home </span> 
                    </a> 
                    
                
                </li>   -->
                <#--  <li  ng-show="$root.subPathBoolean" >
                    
                    <a data-ng-href="{{'#/'+($root.selectedsubParentPage).split(' /')[0]}}"  >  
                        <i class="fa fa-angle-left fa-1x"></i>   
                        <span class="hidden-xs"> Back </span> 
                    </a> 
                    
                
                </li>   -->
                <li ng-mouseover="$root.activeTabOver = item.label; getLeftMargin('level-one-'+((item.label)).split(' ').join('-').toLowerCase()); "  
                 ng-mouseleave="$root.activeTabOver = ''"
                    ng-repeat="item in $root.menuData[0].children track by $index"   
                     
                    ng-if="item.label "
                    ng-class="$root.activeTabOver === item.label  || $root.activeTab === $index ? 'active':''" 
                    ng-click="$root.showView = false; $root.searchFilterDropdownSelected = false; $root.selections.searchInputClicked= false; "> 
                
        
                    
                <div class="btn-group" uib-dropdown dropdown-append-to-body outsideClick is-open="status.isopen"  >
                    
                        <a ng-href="#/{{findClickthrough(item.data.page)}}"  
                        style="padding-bottom:1em;" ng-mouseover = "status.isopen = true; $root.indexOver = $index;  " 
                        ng-click="  $root.indexOver = $root.showView ? $index:'';   $root.calendarShow = false; $root.scheduleShow  = false; $root.applicationTriggerFindUser();"   >
                                <i class="fa fa-fw {{item.icon_class}} fa-1x" ></i>   
                                <span class="hidden-xs"> 
                                {{item.label}}   
                                </span>
                                <span ng-if="$root.menuData[0]['children'][$index].children.length > 0" class="caret"></span>
                        </a>
                
                    </div>

                    
                
                </li> 
               
                
              
            </ul> 
        </div> 
        <div id="page-title" class="col-md-12 col-xs-12 nopadding titleArea" 
        ng-if="$root.values.user.FriendlyName && $root.values.user.FriendlyName != undefined " 
        ng-style="{'top':(70)+'px', 'margin-top':'0px', 'background-color':$root.applicationTitleColor, 'color':$root.applicationTextColor}" 
        style="z-index:0; margin-top:0px ; margin-bottom:0px;     "
        >
        
        </div> 
        <div style="position:fixed; top:82px; z-index :1; left:0px; float:left; width:100%; height:45px;  z-index:9; box-shadow: 0px 0px 20px rgba(0,0,0,0.2);" ng-style="{'background-color':$root.applicationTitleColor}"> 
		<div class="col-md-12 col-xs-12"  >
			 
            <div   ng-style="{  'background-color':'transparent'}"
            style="color:#333; z-index: 99999; margin: 0px; top: 20px; width: auto; font-weight:400;position: relative; display:inline-block;padding-left: 0px; transition: top 1s ease 0s; vertical-align: top !important; background-color: transparent;  " 
              >
             
             <span ng-style="{'color': $root.applicationTextColor}" style="margin-right:10px; padding-right:10px; font-weight:400;   padding-right:10px; padding-left:0px;   ">
                 {{($root.subPathBoolean ? ($root.selectedsubParentPage).split('/').join(' '):$root.pageTitle) | capitalize }}  
             </span>
            
            <span  id="level-two-{{((subitem.label)).split(' ').join('-').toLowerCase()}}" 
                ng-class="subitem.data.page === $root.pathToUse  || $root.activeTabOver === subitem.label ? 'active-subtab' :'not-active-subtab'"
                ng-style="{'color': $root.applicationTextColor}"
                style="padding:7px; font-size:1em; cursor:pointer; box-shadow: 0px -5px 8px rgba(0,0,0, 0.2);     "
                ng-mouseover="$root.activeTabOver = subitem.label"  ng-mouseleave="$root.activeTabOver = ''" 
                ng-repeat-start="subitem in $root.menuData[0]['children'][$root.activeTab].children track by $index"  data-toggle="tab"
                ng-click="$root.showView = false;  "
                > 
                    <span ng-click=" $root.goToPage('#/'+findClickthrough(subitem.data.page))"  
                     
                      >
                     <i class="fa fa-fw {{subitem.icon_class}} fa-1x" ></i> 
                       <span   
                     >  <span class="hidden-xs" > {{subitem.label}}</span>  </span>
                     
                    </span>  
                 
          
            </span> 
             <span  id="level-two-{{((subitem.label)).split(' ').join('-').toLowerCase()}}" 
                ng-class="subitem.data.page === $root.pathToUse  ? 'active-subtab' :''"
                style="padding:7px !important; font-size:1em; cursor:pointer; box-shadow: 0px -5px 8px rgba(0,0,0, 0.2);  "
                
                ng-repeat-end=""  ng-show="subitem.data.page === $root.pathToUse"  data-toggle="tab"
                
                > 
                    <span   
                      >
                      
                     <a   ng-style="{'color': $root.applicationActiveTextColor}"
                     ng-href="{{'#/'+$root.menuData[0]['children'][$root.activeTab].data.page}}"><i class="fa fa-close" 
                      
                       ></i>
                     </a>
                    </span>  
                 
          
            </span> 
            
        </div>  
			
		</div>
	</div>
    </div> 
    
    <div id="filterbtn" class=" btn  "  
     style="  font-size:1.2em; height:50px; width:50px; padding:1.1em; overflow:hidden;  padding-left:1.0em; padding-right:1.0em; position:fixed;  z-index:999999999; border-radius:25px;  border-bottom-left-radius: 25px; border:none; right:5px;   top:10px; margin:0px;  color:#888;  "  
                ng-style="{'background-color': sideOpened ? $root.applicationActivePageColor: $root.applicationHeaderColorSecondary , 'color': !sideOpened ? $root.applicationActivePageColor  :$root.applicationHeaderColorSecondary  }"
                ng-click="sideOpened = !sideOpened;  $root.topOffSet = $root.defaultOffSet; $root.printOpened = false;  $root.topOffSetPageView = ($root.topOffSet); animateSideBar($root.topOffSet, $root.defaultOffSet, sideOpened); $root.triggerResize()"  >
                    <i class="fa "  style="vertical-align:top" ng-style="{'color': $root.applicationActiveTextColor}" ng-class="{'fa-filter' : !sideOpened, 'fa-times':sideOpened }"></i>
    </div>
    
    <div class="right-hand-nav" id="righthandsidebar"   ng-if="$root.values.user.FriendlyName && $root.values.user.FriendlyName != undefined " 
        style="z-index:99999992; margin-top:0px;  overflow:auto; padding-right:10px; padding-top:30px; height:100%;  -webkit-transition:all 1s; transition-property:all; transition-duration: 1s;"
        ng-init="  sideOpened = false;"
        ng-style="{'margin-left': sideOpened ? '-300px':'0px', 'width': $root.innerWidth < 614 ? '100%':'380px'  }"  
        >
        
        
        <h4 style="padding-left:10px; color:#fff;">
            <div  ng-click=" closeApplication($root.showView)" class="pull-left" >
                <span class="pull-left " style="margin-right:5px; color:#fff;"> 
                     <small style="  color:#fff;   padding-top:1em; cursor:pointer; margin-left:10px;  "  >
                        Welcome <span  ng-click="  closeApplication($root.showView)">{{$root.values.user.Name}}</span> <sup> <i class="fa fa-times text-right" ng-click="removeU(); closeApplication($root.showView)"  aria-hidden="true"></i></sup>
                        </small >
                </span> 
                
            </div>
        </h4>
 

        <#--  <div  class="col-md-12 col-xs-12 filter-label" 
          ng-if=" $root.filtersJson && $root.decideToShowFilter( (filter.onlyShow).split(','),  $root.pageTitle) === true"
         ng-repeat="filter in $root.filtersJson track by $index">  
            
                <span class="col-md-12 col-xs-12 label   pull-right small-label"  style="border-radius:0px;" >
                    <small class="pull-right"> {{filter.displayName}}</small>
                </span> 
                <tm1-ui-subnm  ng-if=" filter.alias &&  filter.dimensionSubset"
                tm1-instance="{{$root.defaults.settingsInstance}}"   
                tm1-dimension="{{filter.dimensionName}}" 
                tm1-subset="{{filter.dimensionSubset}}" 
                tm1-default-element="{{$root.defaults[filter['name']]}}"   
                tm1-select-only="filter.selectOnly" 
                tm1-attribute = "{{filter['alias']}}"
                ng-model="$root.selections[filter['name']]"
                tm1-on-change='updateSettings($root.values, $root.defaults, $root.selections, filter.name, {"tm1Dimension":filter.dimensionName, "tm1Alias":filter.alias , "value":data}, filter.defaultElement);    '
                ></tm1-ui-subnm>
                <tm1-ui-subnm  ng-if="!filter.alias  && filter.dimensionSubset"
                tm1-instance="{{$root.defaults.settingsInstance}}"   
                tm1-dimension="{{filter.dimensionName}}" 
                tm1-subset="{{filter.dimensionSubset}}" 
                tm1-default-element="{{$root.defaults[filter['name']]}}"   
                tm1-select-only="filter.selectOnly"  
                ng-model="$root.selections[filter['name']]"
                tm1-on-change='updateSettings($root.values, $root.defaults, $root.selections, filter.name, {"tm1Dimension":filter.dimensionName,  "value":data}, filter.defaultElement);    '
                ></tm1-ui-subnm>
                 <tm1-ui-subnm  ng-if=" filter.alias && filter.dimensionMdx"
                tm1-instance="{{$root.defaults.settingsInstance}}"   
                tm1-dimension="{{filter.dimensionName}}" 
                tm1-mdx="{{filter.dimensionMdx}}" 
                tm1-default-element="{{$root.defaults[filter['name']]}}"   
                tm1-select-only="filter.selectOnly" 
                tm1-attribute = "{{filter['alias']}}"
                ng-model="$root.selections[filter['name']]"
                tm1-on-change='updateSettings($root.values, $root.defaults, $root.selections, filter.name, {"tm1Dimension":filter.dimensionName, "tm1Alias":filter.alias , "value":data}, filter.defaultElement);    '
                ></tm1-ui-subnm>
                <tm1-ui-subnm  ng-if="!filter.alias && filter.dimensionMdx  "
                tm1-instance="{{$root.defaults.settingsInstance}}"   
                tm1-dimension="{{filter.dimensionName}}" 
                tm1-mdx="{{filter.dimensionMdx}}" 
                tm1-default-element="{{$root.defaults[filter['name']]}}"   
                tm1-select-only="filter.selectOnly"  
                ng-model="$root.selections[filter['name']]"
                tm1-on-change='updateSettings($root.values, $root.defaults, $root.selections, filter.name, {"tm1Dimension":filter.dimensionName,  "value":data}, filter.defaultElement);    '
                ></tm1-ui-subnm>
        </div>       -->
                
                
                
        <div ng-click="showPrint()"  class="col-md-12 col-xs-12 filter-label hidden-xs" style="margin-top:10px;"  > 
            <div   class=" pull-right text-center "
                    ng-style="{'background-color':$root.applicationHeaderColorSecondary}" 
                    style="padding-top:1em; cursor:pointer;  color:#fff; margin-left:10px;"    >
                <i  style="margin-right:10px; color:#fff !important;" class="fa fa-print fa-fw"></i> Share  
            </div>
        </div>
        <div  class="col-md-12 col-xs-12 hidden-xs"    >
            <div style="padding-top:10px; border-bottom:1px solid #fff;" >                    
                <span>
                    <select ng-model="print.pageOrientation" class="form-control printpageformat">
                        <option>Landscape</option>
                        <option>Portrait</option>
                    </select>
                    <select ng-model="print.pageSize" class="form-control printdropdown">
                        <option>A5</option>
                        <option>A4</option>
                        <option>A3</option>
                        <option>Letter</option>
                        <option>Tabloid</option>
                    </select>
                
                    <select ng-init="print.outputType = $root.defaults.printOption" ng-model="print.outputType" class="form-control printdropdown">
                        <option value="pdf">PDF</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                    </select>
                </span>
                <#if settings.getPrinterVersion() == "1">
                <a style="color:#fff !important;"  href="print.pdf?url={{pageUrlEncoded()}}&orientation={{print.pageOrientation}}&page-size={{print.pageSize}}" target="_blank">
                <#else>
                <a style="color:#fff !important; margin-top:5px;  margin-bottom:5px;"  href="print-v2.pdf?url={{pageUrlEncoded()}}&orientation={{print.pageOrientation}}&page-size={{print.pageSize}}&output-type={{print.outputType}}" target="_blank">
                </#if>
                    <i style="color:#fff !important; margin-top:5px;  margin-bottom:5px;"  class="fa fa-print fa-fw marginright15"></i> <span translate="PRINT" class="marginright15"></span>
                </a>
            </div>
            <div style="border-color:#fff !important; margin-bottom:10px;" role="separator" class="divider"></div>
            <div style="color:#fff !important;">
                <a style="color:#fff !important;"  href="" ngclipboard data-clipboard-text="{{pageUrl()}}" ngclipboard-success="copySuccess(e);">
                    <i class="fa fa-clipboard fa-fw marginright15"  ></i> <span translate="COPYTOCLIPBOARD"></span>
                    <span class="pull-right">
                    <span ng-if="isCopied" class="label label-default" translate="COPIED"></span>
                    </span>
                </a>
            </div>
            
           
        </div>
        <style>
        a:hover, a:focus {
            color: #555;
            text-decoration: none !important;
        }
        </style>
        <div  class="col-md-12 col-xs-12 filter-label" 
          ng-if=" $root.filtersJson && $root.decideToShowFilter( (filter.onlyShow).split(','),  $root.pageTitle) === true"
         ng-repeat="filter in $root.filtersJson track by $index" >  
            
                <span class="col-md-12 col-xs-12 label   pull-right small-label"  style="border-radius:0px; padding-top:5px; padding-bottom:5px;" >
                    <small class="pull-right"> {{filter.displayName}} ::{{$root.defaults[filter.name]}} | <i class="fa " 
                    ng-class="{'fa-flash':$root.defaults[filter.name],'fa-close':!$root.defaults[filter.name]}"></i> |</small>
                </span> 

                </div>
        <#--  <ul ng-mouseleave = "$root.indexOver =  ''   " 
            id="pop-over-body" 
            ng-if="$root.showView && $root.menuData[0]['children'][$root.indexOver].children.length > 0" 
            style="top:80px !important; font-size:0.8em; margin-top:0px; margin-left:30px"  class="popOverContainer" >
            <li ng-repeat="subitem in $root.menuData[0]['children'][$root.indexOver].children track by $index" 
            ng-mouseover="$root.subPageOver = subitem.label"
            ng-style="{'background-color' :'#fff' }"
            role="menuitem" 
            ng-click="status.isopen = false; $root.indexOver = '';  " 
            style="cursor:pointer; margin:0px; text-decorations:none; padding:0px; padding:1em;   ">
                <a class="listitem" ng-href="#/{{findClickthrough(subitem.data.page)}}" 
                ng-style="{'color': $root.applicationHeaderColorSecondary}"
                style=" width:100%; margin:0px; padding-top:1em; text-decorations:none;">{{subitem.label}} 
                <span style="display:inline-block; float:left; text-align:left; position:absolute; left:0px;   width:100%; height:47px; "></span></a>  
            </li>
        </ul>  -->
    
    
    
       
    </div>
    
</div>

 <#--  <div  ng-show="$root.isLoading" class="loader-container">
        <div class="loader" >
            <i   class="fa fa-square fa-spin fa-3x" ></i>
        </div>
</div>  -->