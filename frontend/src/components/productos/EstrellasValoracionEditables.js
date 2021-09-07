import { React, Component } from 'react';

import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';



class EstrellasValoracionEditables extends Component{

    render(){
        return(
            <>
                <ToggleButtonGroup type="checkbox" >

                <ToggleButton variant="secondary" onClick={() => this.props.setValoracion(1) }>
                    { this.props.valoracion >= 1 ?
                        <StarIcon />
                        :
                        <StarOutlineIcon />
                    }
                </ToggleButton>

                <ToggleButton variant="secondary" onClick={() => this.props.setValoracion(2) }>
                    { this.props.valoracion >= 2 ?
                        <StarIcon />
                        :
                        <StarOutlineIcon />
                    }
                </ToggleButton>

                <ToggleButton variant="secondary" onClick={() => this.props.setValoracion(3) }>
                    { this.props.valoracion >= 3 ?
                        <StarIcon />
                        :
                        <StarOutlineIcon />
                    }
                </ToggleButton>

                <ToggleButton variant="secondary" onClick={() => this.props.setValoracion(4) }>
                    { this.props.valoracion >= 4 ?
                        <StarIcon />
                        :
                        <StarOutlineIcon />
                    }
                </ToggleButton>

                <ToggleButton variant="secondary" onClick={() => this.props.setValoracion(5) }>
                    { this.props.valoracion === 5 ?
                        <StarIcon />
                        :
                        <StarOutlineIcon />
                    }
                </ToggleButton>
            </ToggleButtonGroup>
        </>
        )
    }
}

export default EstrellasValoracionEditables;