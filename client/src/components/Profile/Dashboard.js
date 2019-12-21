import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/profile';


const Dashboard = (props) => {

    console.log(props);
    const { getProfile } = props;

    useEffect(() => {

        console.log("Effect call");
        getProfile();

    }, [getProfile]);

    //use spinner here
    if (props.loading) {
        return (<div className="mt-5">Loading </div>);
    }

    const {
        education,
        experience,
    } = props.profile;
    var userDetails = props.userDetails;
    var { name } = userDetails;
    const currDate = new Date();
    console.log("company is", userDetails);
    //const { userDetails } = props.profile.userde ? props.profile.profile : null;
    return (
        <section className="container">
            <h1 className="large text-primary">
                Dashboard
        </h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome {name}</p>
            <div className="dash-buttons">
                <a href="edit-profile.html" className="btn btn-light"
                ><i className="fas fa-user-circle text-primary"></i> Edit Profile</a
                >
                <a href="add-experience.html" className="btn btn-light"
                ><i className="fab fa-black-tie text-primary"></i> Add Experience</a
                >
                <a href="add-education.html" className="btn btn-light"
                ><i className="fas fa-graduation-cap text-primary"></i> Add Education</a
                >
            </div>

            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {experience.map((exp) => (
                        <tr key={exp._id}>
                            <td>{exp.company}</td>
                            <td className="hide-sm">{exp.title}</td>
                            <td className="hide-sm">
                                {exp.current ? `${currDate.getFullYear()}-${currDate.getDate()}-${currDate.getMonth()}` : exp.to.split("T")[0]}
                                {'   -    '}
                                {exp.from.split("T")[0]}
                            </td>
                            <td>
                                {/** @Todo delete Experince from List */}
                                <button className="btn btn-danger" id={exp._id} >
                                    Delete
                               </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>

            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {education.map((educ) => (
                        <tr key={educ._id}>
                            <td>{educ.school}</td>
                            <td className="hide-sm">{educ.degree}</td>
                            <td className="hide-sm">
                                {educ.current ? `${currDate.getFullYear()}-${currDate.getDate()}-${currDate.getMonth()}` : educ.to.split("T")[0]}
                                {'   -    '}
                                {educ.from.split("T")[0]}
                            </td>
                            <td>
                                <button className="btn btn-danger">
                                    Delete
                           </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="my-2">
                <button className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>

                    Delete My Account
              </button>
            </div>
        </section>

    )
}
const mapStateToProps = state => ({

    profile: state.profile.profile,
    userDetails: state.profile.userDetails,
    loading: state.profile.loading

})

const mapDispatchToProps = dispatch => ({

    getProfile: () => dispatch(actions.profile())

})


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
