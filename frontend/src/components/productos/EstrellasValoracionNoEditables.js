import { React, Component } from 'react';

import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';

class EstrellasValoracionNoEditables extends Component{

    render(){
        return(
            <>
                { this.props.valoracion >= 1 ?
                    <StarIcon/>
                : <StarOutlineIcon/>
                }

                { this.props.valoracion >= 2 ?
                    <StarIcon/>
                : <StarOutlineIcon/>
                }

                { this.props.valoracion >= 3 ?
                    <StarIcon/>
                : <StarOutlineIcon/>
                }

                { this.props.valoracion >= 4 ?
                    <StarIcon/>
                : <StarOutlineIcon/>
                }
                
                { this.props.valoracion >= 5 ?
                    <StarIcon/>
                : <StarOutlineIcon/>
                }
            </>
        )
    }
}

export default EstrellasValoracionNoEditables;