import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import 'admin_dashboard_screen.dart';
import 'admin_assignments_screen.dart';
import 'admin_reports_screen.dart';
import 'admin_tasks_screen.dart';
import 'admin_volunteers_screen.dart';
import 'admin_settings_screen.dart';

enum _AdminPage { dashboard, tasks, reports, volunteers, assignments, settings }

class AdminShell extends ConsumerStatefulWidget {
  const AdminShell({super.key});

  @override
  ConsumerState<AdminShell> createState() => _AdminShellState();
}

class _AdminShellState extends ConsumerState<AdminShell> {
  _AdminPage _page = _AdminPage.dashboard;

  @override
  Widget build(BuildContext context) {
    final body = switch (_page) {
      _AdminPage.dashboard => AdminDashboardScreen(
          onNavigateToSettings: () => _select(_AdminPage.settings),
        ),
      _AdminPage.tasks => const AdminTasksScreen(),
      _AdminPage.reports => const AdminReportsScreen(),
      _AdminPage.volunteers => const AdminVolunteersScreen(),
      _AdminPage.assignments => const AdminAssignmentsScreen(),
      _AdminPage.settings => const AdminSettingsScreen(),
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('NGO Admin'),
        actions: [
          IconButton(
            onPressed: () async {
              final shouldSignOut = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Sign Out'),
                  content: const Text('Are you sure you want to sign out?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      child: const Text('Cancel'),
                    ),
                    FilledButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      child: const Text('Sign Out'),
                    ),
                  ],
                ),
              );

              if (shouldSignOut == true && context.mounted) {
                await ref.read(authProvider).signOut();
                if (context.mounted) {
                  context.go('/login');
                }
              }
            },
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: ListView(
            children: [
              const ListTile(
                title: Text('Resource-Devta'),
                subtitle: Text('Admin suite'),
                leading: Icon(Icons.shield_outlined),
              ),
              const Divider(),
              _navTile(
                label: 'Dashboard',
                icon: Icons.dashboard_outlined,
                selected: _page == _AdminPage.dashboard,
                onTap: () => _select(_AdminPage.dashboard),
              ),
              _navTile(
                label: 'Tasks',
                icon: Icons.checklist_outlined,
                selected: _page == _AdminPage.tasks,
                onTap: () => _select(_AdminPage.tasks),
              ),
              _navTile(
                label: 'Reports',
                icon: Icons.description_outlined,
                selected: _page == _AdminPage.reports,
                onTap: () => _select(_AdminPage.reports),
              ),
              _navTile(
                label: 'Volunteers',
                icon: Icons.groups_outlined,
                selected: _page == _AdminPage.volunteers,
                onTap: () => _select(_AdminPage.volunteers),
              ),
              _navTile(
                label: 'Assignments',
                icon: Icons.assignment_turned_in_outlined,
                selected: _page == _AdminPage.assignments,
                onTap: () => _select(_AdminPage.assignments),
              ),
              const Divider(),
              _navTile(
                label: 'Settings',
                icon: Icons.settings_outlined,
                selected: _page == _AdminPage.settings,
                onTap: () => _select(_AdminPage.settings),
              ),
            ],
          ),
        ),
      ),
      body: SafeArea(child: body),
    );
  }

  Widget _navTile({
    required String label,
    required IconData icon,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return ListTile(
      selected: selected,
      leading: Icon(icon),
      title: Text(label),
      onTap: onTap,
    );
  }

  void _select(_AdminPage p) {
    setState(() => _page = p);
    Navigator.of(context).pop();
  }
}

