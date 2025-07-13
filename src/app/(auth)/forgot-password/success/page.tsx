'use client';

import { 
  Box, 
  Container, 
  Card, 
  Flex, 
  Heading, 
  Text
} from '@radix-ui/themes';
import { 
  LockClosedIcon
} from '@radix-ui/react-icons';

export default function ForgotPasswordSuccessPage() {
  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--gray-1) 0%, var(--gray-3) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <Container size="1" style={{ width: '100%', maxWidth: '400px' }}>
        <Card size="3" style={{ padding: '32px' }}>
          <Flex direction="column" align="center" gap="4">
            {/* Header */}
            <Box style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--accent-9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LockClosedIcon color="white" width="24" height="24" />
            </Box>
            
            <Heading size="6" align="center">
              Check your email
            </Heading>

            <Text size="3" color="gray" align="center" style={{ lineHeight: '1.5' }}>
              We have sent you an email with a link to reset your password.
            </Text>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
