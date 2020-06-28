import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Loading from '../../../components/loading';
import { getTeams } from '../../../services/api';


const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

export default function AdminTeamsPage() {
    const classes = useStyles();

    const [loadingVisible, setLoadingVisible] = useState(false);
    const [teams, setTeams] = useState([]);
    
    const loadTeams = async () => {
		setLoadingVisible(true);
		const response = await getTeams();
		setLoadingVisible(false);
		if (response.status === 200) {
			if (response.data !== undefined && response.data != null) {
				setTeams(response.data.items)
			}
		}
    }
    
    useEffect(() => {
		loadTeams();
	}, []);

    return (
        <div>
			<Loading
                visible={loadingVisible}
            />

			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Nome</TableCell>	
						</TableRow>
					</TableHead>

					<TableBody>
						{teams.map((item) => (
							<TableRow key={item.oid}>
								<TableCell>{item.name}</TableCell>
							</TableRow>
						))}		
					</TableBody>
				</Table>
			</TableContainer>
		</div>
    )
}