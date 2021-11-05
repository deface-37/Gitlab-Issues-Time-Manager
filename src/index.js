import MilestoneElement from './components/milestone/Milestone'
import './style.scss'

const wrapper = document.querySelector('.wrapper')

const milestone = new MilestoneElement()

wrapper.append(milestone)

milestone.createIssue({title: 'Test task',spend: 5, estimated: 19})
milestone.createIssue({title: 'Test task 2',spend: 15, estimated: 21})
