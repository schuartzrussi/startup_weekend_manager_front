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
import {getPitchs} from '../../../services/api';


const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

export default function AdminPitsPage() {
	const classes = useStyles();

    const [loadingVisible, setLoadingVisible] = useState(false);
	const [pitchs, setPitchs] = useState([])

	const loadPitchs = async () => {
		setLoadingVisible(true);
		const response = await getPitchs();
		setLoadingVisible(false);
		if (response.status === 200) {
			if (response.data !== undefined && response.data != null) {
				setPitchs(response.data.items)
			}
		}
	}

	useEffect(() => {
		loadPitchs();
	}, [])

	return (
		<div>
			<Loading
                visible={loadingVisible}
            />

			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Descricao</TableCell>	
							<TableCell>Usuario</TableCell>	
						</TableRow>
					</TableHead>

					<TableBody>
						{pitchs.map((item) => (
							<TableRow key={item.oid}>
								<TableCell>{item.name}</TableCell>
								<TableCell>TODO Ariel</TableCell>
							</TableRow>
						))}		
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}
