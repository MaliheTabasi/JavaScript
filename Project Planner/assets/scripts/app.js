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
    constructor(closeNotifierFn) {
        super('active-projects', true);
        this.closeNotifier = closeNotifierFn;
        this.create();
    }
    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }
   
    create() {
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'card';
        tooltipEl.textContent = 'hi';
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
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const tooltip = new Tooltip( () => {this.hasActiveTooltip = false;} );
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoBtn() {
        const ProjectItemEl = document.getElementById(this.id);
        let moreInfoBtn = ProjectItemEl.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler )
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

}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type))
        }
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
    }
}

App.init(); 