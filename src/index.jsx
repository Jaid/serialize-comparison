import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import Switch from "react-switch";
import css from "./style.scss"
import installs from "data/installs"

export default class InstallSwitches extends React.Component {

    static propTypes = {
        schema: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        value: PropTypes.any.isRequired
    }

    onChange = (id, value) => {
        if (value) {
            this.props.onChange([id, ...this.props.value])
        } else {
            this.props.onChange(this.props.value.filter(install => install !== id))
        }
    }

    render() {
        return this.props.schema.items.enum.map(id => {
            const install = installs.find(findingInstall => findingInstall.id === id)
            return <div key={install.id}>
                <Switch
                    className={css.switch}
                    checkedIcon=<span className={css.installText}/>
                    uncheckedIcon={null}
                    width={100}
                    onColor="#70c370"
                    boxShadow="0 0 7px #00000066"
                    id={install.id}
                    checked={this.props.value.includes(install.id)}
                    onChange={value => this.onChange(install.id, value)}
                />
                <label htmlFor={install.id} className={classnames(css.label, this.props.value && css.install)}>{install.title}</label>
            </div>
        })
    }

}
