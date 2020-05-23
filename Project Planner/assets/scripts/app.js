class DOMHelper {
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveEl(elId, newDEstinationSelector) {
        const element = document.getElementById(elId);
        const destinationEl = document.querySelector(newDEstinationSelector);
        destinationEl.append(element);
    }
}

class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if(this.element) {
            this.element.parentElement.removeChild(this.element);
        }
    }

    attach() {
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin': 'beforeend',
        this.element);
    }
}

class Tooltip extends Component {
    constructor(closeNotifierFn, text, hostElemetId) {
        super(hostElemetId);
        this.closeNotifier = closeNotifierFn;
        this.text = text;
        this.create();
    }
    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }
   
    create() {
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        console.log(tooltipTemplate.content)
        console.log(tooltipBody)

        tooltipBody.querySelector('p').textContent = this.text;
        tooltipEl.append(tooltipBody);

        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElHeight = this.hostElement.clientHeight;
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentElementScrolling -10;

        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = x + 'px';
        tooltipEl.style.top = y + 'px';


        tooltipEl.addEventListener('click', this.closeTooltip);
        this.element = tooltipEl;
    }
}

class ProjectItem {
    hasActiveTooltip = false;
    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoBtn();
        this.connectSwitchBtn(type);
        this.connectDrag();
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip( () => 
        {this.hasActiveTooltip = false;}, tooltipText, this.id );
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoBtn() {
        const ProjectItemEl = document.getElementById(this.id);
        let moreInfoBtn = ProjectItemEl.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this) )
    }

    connectSwitchBtn(type) {
        const ProjectItemEl = document.getElementById(this.id);
        let switchBtn = ProjectItemEl.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Aactivate';
        switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
    }

    update(updateProjectListFn, type) {
        this.updateProjectListsHandler = updateProjectListFn;
        this.connectSwitchBtn(type);
    }

    connectDrag() {
        document.getElementById(this.id).addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        })
    }

}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type))
        }
        this.connectDrappable();
    }

    connectDrappable() {
        const list = document.querySelector(`#${this.type}-projects ul`);
        list.addEventListener('dragenter', event => {
            if( event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                list.parentElement.classList.add('droppable')
            }
        })

        list.addEventListener('dragover', event => {
            if( event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                list.parentElement.classList.add('droppable')

            } 
        })

        list.addEventListener('dragleave',event => {
            if ( event.relatedTarget.closest(`#${this.type}-projects ul`) !== list ) {
                list.parentElement.classList.remove('droppable')
            }
        })

        list.addEventListener('drop', event => {
            const prjId = event.dataTransfer.getData('text/plain');
            if (this.projects.find( p => p.id === prjId)) {
                return;
            }
            document.getElementById(prjId).querySelector('button:last-of-type').click();
            event.preventDefault();
            list.parentElement.classList.remove('droppable');
        })
    }

    setSwitchHandler(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveEl(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectId) {
        // const projectIndex = this.projects.findIndex(p => p.id === projectId);
        // this.projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    static init() {
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandler(finishedProjectsList.addProject.bind(finishedProjectsList));
        finishedProjectsList.setSwitchHandler(activeProjectsList.addProject.bind(activeProjectsList));

        // const timerId = setTimeout(this.startAnalytics, 3000);
        // document.getElementById('send-analytics').addEventListener('click', () => {
        //     clearTimeout(timerId);
        // })
    }

    static startAnalytics() {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = 'assets/scripts/analytics.js';
        analyticsScript.defer = true;
        console.log(analyticsScript)
        document.head.append(analyticsScript);
    }
}

App.init(); 