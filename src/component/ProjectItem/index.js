import './index.css'

const ProjectItem = props => {
  const {projectItemDetails} = props
  const {name, imageUrl} = projectItemDetails

  return (
    <li className="listItem">
      <img src={imageUrl} alt={name} className="projectImage" />
      <p className="projectName">{name}</p>
    </li>
  )
}

export default ProjectItem
