import Loader from 'react-loader-spinner'
import {Component} from 'react'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    projects: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projects: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getProjects(),
    )
  }

  onClickRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failureImage"
      />
      <h1 className="failureDescription">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retryButton" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loadingView-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#00BFFF" />
    </div>
  )

  renderProjectsView = () => {
    const {projects} = this.state

    return (
      <ul className="projectsList-container">
        {projects.map(each => (
          <ProjectItem projectItemDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderProjectsView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <div className="app-container">
        <select
          className="inputSelect"
          value={activeCategoryId}
          onChange={this.onChangeCategory}
        >
          {categoriesList.map(each => (
            <option value={each.id} key={each.id} className="options">
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderProjects()}
      </div>
    )
  }
}

export default Projects
